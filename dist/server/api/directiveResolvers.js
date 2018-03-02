"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.getDirectiveResolvers = async (BASE_PATH) => {
    try {
        return require(path_1.resolve(`${BASE_PATH}/directiveResolvers`));
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            throw new ReferenceError('The file `./directiveResolvers.ts` or `./directiveResolvers/index.ts` is required.');
        }
        throw error;
    }
};
//# sourceMappingURL=directiveResolvers.js.map