import { resolve } from 'path';

/**
 * Require the grial.config or get a default empty object
 * @param  {String} [BASE_PATH='.'] The base path of your application
 * @return {Object}                 The configuration object
 */
export const getConfig = async (BASE_PATH = '.') => {
  try {
    return require(resolve(`${BASE_PATH}/grial.config`));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return {};
    }
    throw error;
  }
};
