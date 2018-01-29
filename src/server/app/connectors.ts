import { resolve } from 'path';

export const getConnectors = async (BASE_PATH: string) => {
  try {
    return await import(resolve(`${BASE_PATH}/connectors`));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return {};
    }
    throw error;
  }
};
