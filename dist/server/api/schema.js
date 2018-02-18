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
// native
const os = require("os");
const fs = require("fs");
const path_1 = require("path");
const util_1 = require("util");
// promisified
const readFile = util_1.promisify(fs.readFile);
const readdir = util_1.promisify(fs.readdir);
const stat = util_1.promisify(fs.stat);
// Returns only graphql files from a folder
const getSchemaFiles = (folder) => __awaiter(this, void 0, void 0, function* () {
    const files = (yield readdir(path_1.resolve(folder))) || [];
    return files
        .map((file) => folder + '/' + file)
        .filter((file) => __awaiter(this, void 0, void 0, function* () { return (yield stat(file)).isFile(); }))
        .filter((file) => file.endsWith('.gql') || file.endsWith('.graphql'));
});
// Returns concatenated schemas content
const getSchemasContent = (folder) => __awaiter(this, void 0, void 0, function* () {
    const files = yield getSchemaFiles(path_1.resolve(folder));
    const schemas = yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () { return readFile(file, 'utf8'); })));
    return schemas.length > 0 && schemas.reduce((previous, current) => previous + os.EOL + current);
});
exports.getSchema = (BASE_PATH) => __awaiter(this, void 0, void 0, function* () {
    try {
        let schema = yield getSchemasContent(path_1.resolve(`${BASE_PATH}`));
        if (schema && schema.length > 0) {
            return schema;
        }
        schema = yield getSchemasContent(path_1.resolve(`${BASE_PATH}/schemas/`));
        if (schema && schema.length > 0) {
            return schema;
        }
        throw new ReferenceError('The file `./schema.gql` or `./schema.graphql` is required.');
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            throw new ReferenceError('The file `./schema.gql` or `./schema.graphql` is required.');
        }
        throw error;
    }
});
//# sourceMappingURL=schema.js.map