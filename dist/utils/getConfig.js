"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
/**
 * Require the grial.config or get a default empty object
 * @param  {String} [BASE_PATH='.'] The base path of your application
 * @return {Object}                 The configuration object
 */
exports.getConfig = async (BASE_PATH = '.') => {
    try {
        return await Promise.resolve().then(() => require(path_1.resolve(`${BASE_PATH}/grial.config`)));
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            return {};
        }
        throw error;
    }
};
//# sourceMappingURL=getConfig.js.map