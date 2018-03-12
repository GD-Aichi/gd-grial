"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const merge_graphql_schemas_1 = require("merge-graphql-schemas");
exports.getResolvers = async (BASE_PATH) => {
    try {
        const typesArray = merge_graphql_schemas_1.fileLoader(path_1.resolve(`${BASE_PATH}/resolvers`), { recursive: false });
        return merge_graphql_schemas_1.mergeResolvers(typesArray);
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            throw new ReferenceError('The file(s) `./resolvers/` is required.');
        }
        throw error;
    }
};
//# sourceMappingURL=resolvers.js.map