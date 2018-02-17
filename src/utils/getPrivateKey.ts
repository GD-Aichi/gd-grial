import { resolve } from 'path';
import { readFile } from 'fs';
import { promisify } from 'util';
const readFilePromis = promisify(readFile);

/**
 * Require the grial.config or get a default empty object
 * @param  {String} [BASE_PATH='.'] The base path of your application
 * @return {Object}                 The configuration object
 */
export const getPrivateKey = async (BASE_PATH = '.'): Promise<string> => {
  try {
    return await readFilePromis(resolve(`${BASE_PATH}/private.key`), 'utf8');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return;
    }
    throw error;
  }
};
