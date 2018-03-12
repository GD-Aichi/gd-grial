"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// native
const os = require("os");
const fs = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const merge_graphql_schemas_1 = require("merge-graphql-schemas");
// promisified
const readFile = util_1.promisify(fs.readFile);
const readdir = util_1.promisify(fs.readdir);
const stat = util_1.promisify(fs.stat);
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
const getSchemaMerge = async (folder) => {
    const typesArray = merge_graphql_schemas_1.fileLoader(folder, { recursive: true });
    return merge_graphql_schemas_1.mergeTypes(typesArray, { all: true });
};
exports.getSchema = async (BASE_PATH) => {
    try {
        let schema = await getSchemasContent(path_1.resolve(`${BASE_PATH}`));
        if (schema && schema.length > 0) {
            return schema;
        }
        schema = await getSchemaMerge(path_1.resolve(`${BASE_PATH}/schemas/`));
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