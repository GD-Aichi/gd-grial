import { resolve } from 'path';

export const getResolvers = async (BASE_PATH: string) => {
  try {
    return require(resolve(`${BASE_PATH}/resolvers`));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new ReferenceError('The file `./resolvers.ts` or `./resolvers/index.ts` is required.');
    }
    throw error;
  }
};
