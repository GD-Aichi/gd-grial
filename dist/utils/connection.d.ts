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
export declare const base64: (i: string) => string;
export declare const unbase64: (i: string) => string;
/**
 * Creates the cursor string from an offset.
 */
export declare const toCursor: (offset: number) => string;
/**
 * Rederives the offset from the cursor string.
 */
export declare const fromCursor: (cursor: string) => number;
export declare const getNodesFromConnection: <TConnection extends Node, TModel extends Model<TModel>>(connection: ConnectionArguments, model: any) => Promise<Connection<TConnection>>;
