"use strict";
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
// https://gist.github.com/kethinov/6658166
// List all files in a directory in Node.js recursively in a synchronous fashion
const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist = walkSync(dir + file + '/', filelist);
        }
        else {
            filelist.push(file);
        }
    });
    return filelist;
};
// Returns only graphql files from a folder
const getSchemaFiles = async (folder) => {
    const files = (await readdir(path_1.resolve(folder))) || [];
    return files
        .map((file) => folder + '/' + file)
        .filter(async (file) => (await stat(file)).isFile())
        .filter((file) => file.endsWith('.gql') || file.endsWith('.graphql'));
};
// Returns concatenated schemas content
const getSchemasContent = async (folder) => {
    const files = await getSchemaFiles(path_1.resolve(folder));
    const schemas = await Promise.all(files.map(async (file) => readFile(file, 'utf8')));
    return schemas.length > 0 && schemas.reduce((previous, current) => previous + os.EOL + current);
};
exports.getSchema = async (BASE_PATH) => {
    try {
        let schema = await getSchemasContent(path_1.resolve(`${BASE_PATH}`));
        if (schema && schema.length > 0) {
            return schema;
        }
        schema = await getSchemasContent(path_1.resolve(`${BASE_PATH}/schemas/`));
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
};
//# sourceMappingURL=schema.js.map