// native
import * as os from 'os';
import * as fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

// promisified
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Returns only graphql files from a folder
const getSchemaFiles = async (folder: string) => {
  const files: string[] = (await readdir(resolve(folder))) || [];

  return files
    .map((file: string): string => folder + '/' + file)
    .filter(async (file: string): Promise<boolean> => (await stat(file)).isFile())
    .filter((file: string): boolean => file.endsWith('.gql') || file.endsWith('.graphql'));
};

// Returns concatenated schemas content
const getSchemasContent = async (folder: string) => {
  const files: string[] = await getSchemaFiles(resolve(folder));
  const schemas = await Promise.all(files.map(async (file: string) => readFile(file, 'utf8')));
  return schemas.length > 0 && schemas.reduce((previous, current) => previous + os.EOL + current);
};

const getSchemaMerge = async (folder: string) => {
  const typesArray = fileLoader(folder, { recursive: true });
  return mergeTypes(typesArray, { all: true });
};

export const getSchema = async (BASE_PATH: string) => {
  try {
    let schema = await getSchemasContent(resolve(`${BASE_PATH}`));
    if (schema && schema.length > 0) {
      return schema;
    }

    schema = await getSchemaMerge(resolve(`${BASE_PATH}/schemas/`));
    if (schema && schema.length > 0) {
      return schema;
    }

    throw new ReferenceError('The file `./schema.gql` or `./schema.graphql` is required.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new ReferenceError('The file `./schema.gql` or `./schema.graphql` is required.');
    }
    throw error;
  }
};
