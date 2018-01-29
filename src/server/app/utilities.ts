import { resolve } from 'path';

export const getUtilities = async (BASE_PATH: string) => {
  try {
    return await import(resolve(`${BASE_PATH}/utilities`));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return {};
    }
    throw error;
  }
};
