"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const util_1 = require("util");
const readFilePromis = util_1.promisify(fs_1.readFile);
/**
 * Require the grial.config or get a default empty object
 * @param  {String} [BASE_PATH='.'] The base path of your application
 * @return {Object}                 The configuration object
 */
exports.getPrivateKey = async (BASE_PATH = '.') => {
    try {
        return await readFilePromis(path_1.resolve(`${BASE_PATH}/private.pem`), 'utf8');
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            return;
        }
        throw error;
    }
};
//# sourceMappingURL=getPrivateKey.js.map