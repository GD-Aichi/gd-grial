/**
 * Create a new instantiate function
 * @param  {Object}   params The parameters to use to create new instances
 * @return {Function}        The instantiate function
 */
export const instantiate = (params: any): Function => {
  /**
   * Use the factory function with the given params to create a new instance
   * @param  {String}   name    The factory name
   * @param  {Function} factory The factory function
   * @return {Array}            The factory name and the created instance
   */
  return async ([name, factory]: [string, Function]): Promise<[string, Promise<any>]> => [name, await factory(params)];
};
