import { resolve } from 'path';

export const getModels = async (BASE_PATH: string) => {
  try {
    return await import(resolve(`${BASE_PATH}/models`));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return {};
    }
    throw error;
  }
};
