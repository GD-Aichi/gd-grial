import { Op } from 'sequelize';
import { Model } from 'sequelize-typescript';

export interface Node {
  id: number;
}

/**
 * A flow type describing the arguments a connection field receives in GraphQL.
 */
export interface ConnectionArguments {
  before?: string;
  after?: string;
  first?: number;
  last?: number;
}
/**
 * A flow type designed to be exposed as `PageInfo` over GraphQL.
 */
export interface PageInfo {
  startCursor?: string;
  endCursor?: string;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

/**
 * A flow type designed to be exposed as a `Connection` over GraphQL.
 */
export interface Connection<T> {
  edges: Array<Edge<T>>;
  nodes: Array<T>;
  pageInfo: PageInfo;
  totalCount: number;
}

/**
 * A flow type designed to be exposed as a `Edge` over GraphQL.
 */
export interface Edge<T> {
  node: T;
  cursor: string;
}

// base64.js
export const base64 = (i: string): string => {
  return Buffer.from(i, 'utf8').toString('base64');
};

export const unbase64 = (i: string): string => {
  return Buffer.from(i, 'base64').toString('utf8');
};

const PREFIX = 'cursor:';

/**
 * Creates the cursor string from an offset.
 */
export const toCursor = (offset: number): string => {
  return base64(PREFIX + offset);
};

/**
 * Rederives the offset from the cursor string.
 */
export const fromCursor = (cursor: string): number => {
  return parseInt(unbase64(cursor).substring(PREFIX.length), 10);
};

export const getNodesFromConnection = async <TConnection extends Node, TModel extends Model<TModel>>(
  connection: ConnectionArguments,
  model: any
): Promise<Connection<TConnection>> => {
  const { after, before, first, last } = connection;
  let limit: number = 0;
  const order: string[] = ['id', first ? 'ASC' : 'DESC'];

  if (first || last) {
    if (typeof first === 'number') {
      if (first < 0) {
        throw new Error('Argument "first" must be a non-negative integer');
      }
    }
    if (typeof last === 'number') {
      if (last < 0) {
        throw new Error('Argument "last" must be a non-negative integer');
      }
    }
    limit = first || last;
  }

  // Use before or after cursors to move the query window
  let where;
  if (after) {
    where = {
      id: { [Op.gt]: fromCursor(after) }
    };
  } else if (before) {
    where = {
      id: { [Op.lt]: fromCursor(before) }
    };
  }

  // Run the query
  const list = await (<Array<Model<TModel>>>model.findAll({
    where,
    limit,
    order
  }));

  const nodes: Array<TConnection> = list.map((value: Model<TModel>) => value.toJSON());

  const edges: Array<Edge<TConnection>> = nodes.map((value, index) => ({
    cursor: toCursor(value.id),
    node: value
  }));

  const firstEdge: Edge<TConnection> = edges[0];
  const lastEdge: Edge<TConnection> = edges[edges.length - 1];

  // Check if there's a previous
  const previous = await (<Model<TModel>>model.findOne({
    where: { id: { [Op.lt]: firstEdge.node.id } }
  }));
  const hasPreviousPage: boolean = !!previous;

  // Check if there's a next
  const next = await (<Model<TModel>>model.findOne({
    where: { id: { [Op.gt]: lastEdge.node.id } }
  }));
  const hasNextPage: boolean = !!next;

  const totalCount: number = await model.count();

  // Make a connection object

  return {
    totalCount,
    edges,
    nodes,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage,
      hasNextPage
    }
  };
};
