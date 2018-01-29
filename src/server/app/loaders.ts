import { resolve } from 'path';

export const getLoaders = async (BASE_PATH: string) => {
  try {
    return await import(resolve(`${BASE_PATH}/loaders`));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return {};
    }
    throw error;
  }
};
