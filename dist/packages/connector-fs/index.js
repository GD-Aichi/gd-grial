"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util_1 = require("util");
const existFile = util_1.promisify(fs.stat);
const writeFile = util_1.promisify(fs.writeFile);
const readFile = util_1.promisify(fs.readFile);
const unlinkFile = util_1.promisify(fs.unlink);
exports.filesystem = async () => {
    return {
        async write(filePath, data, options = 'utf8') {
            await writeFile(filePath, data, options);
            return data;
        },
        async read(filePath, options = 'utf8') {
            return readFile(filePath, options);
        },
        async delete(filePath) {
            await unlinkFile(filePath);
            return true;
        },
        async check(filePath) {
            return existFile(filePath);
        }
    };
};
//# sourceMappingURL=index.js.map