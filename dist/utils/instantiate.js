"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new instantiate function
 * @param  {Object}   params The parameters to use to create new instances
 * @return {Function}        The instantiate function
 */
exports.instantiate = (params) => {
    /**
     * Use the factory function with the given params to create a new instance
     * @param  {String}   name    The factory name
     * @param  {Function} factory The factory function
     * @return {Array}            The factory name and the created instance
     */
    return async ([name, factory]) => [name, await factory(params)];
};
//# sourceMappingURL=instantiate.js.map