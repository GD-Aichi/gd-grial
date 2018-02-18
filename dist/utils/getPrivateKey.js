"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.getPrivateKey = (BASE_PATH = '.') => __awaiter(this, void 0, void 0, function* () {
    try {
        return yield readFilePromis(path_1.resolve(`${BASE_PATH}/private.pem`), 'utf8');
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            return;
        }
        throw error;
    }
});
//# sourceMappingURL=getPrivateKey.js.map