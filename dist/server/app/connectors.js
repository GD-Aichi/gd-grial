"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.getConnectors = async (BASE_PATH) => {
    try {
        return await Promise.resolve().then(() => require(path_1.resolve(`${BASE_PATH}/connectors`)));
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            return {};
        }
        throw error;
    }
};
//# sourceMappingURL=connectors.js.map