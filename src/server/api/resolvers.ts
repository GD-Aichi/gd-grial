import { resolve } from 'path';
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';

export const getResolvers = async (BASE_PATH: string) => {
  try {
    const typesArray = fileLoader(resolve(`${BASE_PATH}/resolvers`));
    return mergeResolvers(typesArray);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new ReferenceError('The file(s) `./resolvers/` is required.');
    }
    throw error;
  }
};
