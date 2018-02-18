"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    return ([name, factory]) => __awaiter(this, void 0, void 0, function* () { return [name, yield factory(params)]; });
};
//# sourceMappingURL=instantiate.js.map