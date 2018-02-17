import { resolve } from 'path';

/**
 * Require the auth or get a default empty object
 * @param  {String} [BASE_PATH='.'] The base path of your application
 * @return {Object}                 The auth object
 */
export const getAuth = async (BASE_PATH = '.') => {
  try {
    return await import(resolve(`${BASE_PATH}/auth`));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return {};
    }
    throw error;
  }
};
