import { resolve } from 'path';

export const getDirectiveResolvers = async (BASE_PATH: string) => {
  try {
    return require(resolve(`${BASE_PATH}/directiveResolvers`));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new ReferenceError('The file `./directiveResolvers.ts` or `./directiveResolvers/index.ts` is required.');
    }
    throw error;
  }
};
