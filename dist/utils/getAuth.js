"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
/**
 * Require the auth or get a default empty object
 * @param  {String} [BASE_PATH='.'] The base path of your application
 * @return {Object}                 The auth object
 */
exports.getAuth = async (BASE_PATH = '.') => {
    try {
        return await Promise.resolve().then(() => require(path_1.resolve(`${BASE_PATH}/auth`)));
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            return {};
        }
        throw error;
    }
};
//# sourceMappingURL=getAuth.js.map