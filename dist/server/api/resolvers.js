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
const path_1 = require("path");
exports.getResolvers = (BASE_PATH) => __awaiter(this, void 0, void 0, function* () {
    try {
        return require(path_1.resolve(`${BASE_PATH}/resolvers`));
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            throw new ReferenceError('The file `./resolvers.ts` or `./resolvers/index.ts` is required.');
        }
        throw error;
    }
});
//# sourceMappingURL=resolvers.js.map