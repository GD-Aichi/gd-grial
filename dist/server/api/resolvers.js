"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.getResolvers = async (BASE_PATH) => {
    try {
        return require(path_1.resolve(`${BASE_PATH}/resolvers`));
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            throw new ReferenceError('The file `./resolvers.ts` or `./resolvers/index.ts` is required.');
        }
        throw error;
    }
};
//# sourceMappingURL=resolvers.js.map