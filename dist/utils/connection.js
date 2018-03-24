"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// base64.js
exports.base64 = (i) => {
    return Buffer.from(i, 'utf8').toString('base64');
};
exports.unbase64 = (i) => {
    return Buffer.from(i, 'base64').toString('utf8');
};
const PREFIX = 'cursor:';
/**
 * Creates the cursor string from an offset.
 */
exports.toCursor = (offset) => {
    return exports.base64(PREFIX + offset);
};
/**
 * Rederives the offset from the cursor string.
 */
exports.fromCursor = (cursor) => {
    return parseInt(exports.unbase64(cursor).substring(PREFIX.length), 10);
};
exports.getNodesFromConnection = async (connection, model) => {
    const { after, before, first, last } = connection;
    let limit = 0;
    const order = ['id', first ? 'ASC' : 'DESC'];
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
            id: { [sequelize_1.Op.gt]: exports.fromCursor(after) }
        };
    }
    else if (before) {
        where = {
            id: { [sequelize_1.Op.lt]: exports.fromCursor(before) }
        };
    }
    // Run the query
    const list = await model.findAll({
        where,
        limit,
        order
    });
    const nodes = list.map((value) => value.toJSON());
    const edges = nodes.map((value, index) => ({
        cursor: exports.toCursor(value.id),
        node: value
    }));
    const firstEdge = edges[0];
    const lastEdge = edges[edges.length - 1];
    // Check if there's a previous
    const previous = await model.findOne({
        where: { id: { [sequelize_1.Op.lt]: firstEdge.node.id } }
    });
    const hasPreviousPage = !!previous;
    // Check if there's a next
    const next = await model.findOne({
        where: { id: { [sequelize_1.Op.gt]: lastEdge.node.id } }
    });
    const hasNextPage = !!next;
    const totalCount = await model.count();
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
//# sourceMappingURL=connection.js.map