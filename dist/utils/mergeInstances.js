"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Merge instances into a single map
 * @param  {Object} instances The current instances
 * @param  {String} name      The instance name
 * @param  {Object} instance  The instance to merge
 * @return {Object}           The new instances map
 */
exports.mergeInstances = (instances, [name, instance]) => {
    return Object.assign({}, instances, { [name]: instance });
};
//# sourceMappingURL=mergeInstances.js.map