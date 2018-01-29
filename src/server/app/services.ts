import { resolve } from 'path';

export const getServices = async (BASE_PATH: string) => {
  try {
    return await import(resolve(`${BASE_PATH}/services`));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return {};
    }
    throw error;
  }
};
