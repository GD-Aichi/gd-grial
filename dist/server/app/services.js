"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.getServices = async (BASE_PATH) => {
    try {
        return await Promise.resolve().then(() => require(path_1.resolve(`${BASE_PATH}/services`)));
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            return {};
        }
        throw error;
    }
};
//# sourceMappingURL=services.js.map