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
const fs = require("fs");
const util_1 = require("util");
const existFile = util_1.promisify(fs.stat);
const writeFile = util_1.promisify(fs.writeFile);
const readFile = util_1.promisify(fs.readFile);
const unlinkFile = util_1.promisify(fs.unlink);
exports.filesystem = () => __awaiter(this, void 0, void 0, function* () {
    return {
        write(filePath, data, options = 'utf8') {
            return __awaiter(this, void 0, void 0, function* () {
                yield writeFile(filePath, data, options);
                return data;
            });
        },
        read(filePath, options = 'utf8') {
            return __awaiter(this, void 0, void 0, function* () {
                return readFile(filePath, options);
            });
        },
        delete(filePath) {
            return __awaiter(this, void 0, void 0, function* () {
                yield unlinkFile(filePath);
                return true;
            });
        },
        check(filePath) {
            return __awaiter(this, void 0, void 0, function* () {
                return existFile(filePath);
            });
        }
    };
});
//# sourceMappingURL=index.js.map