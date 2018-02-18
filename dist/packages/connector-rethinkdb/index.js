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
const r = require("rethinkdb");
const getConfig_1 = require("../../utils/getConfig");
exports.rethinkdb = (env) => __awaiter(this, void 0, void 0, function* () {
    let baseConfig = {
        db: env.RETHINK_DB || 'test',
        user: env.RETHINK_USER || 'admin',
        pass: env.RETHINK_PASS || '',
        host: env.RETHINK_HOST || 'localhost',
        port: env.RETHINK_PORT || 28015
    };
    const config = yield getConfig_1.getConfig(env.BASE_PATH || '');
    if ('connectors' in config &&
        'rethinkdb' in config.connectors &&
        typeof config.connectors.rethinkdb === 'function') {
        return r.connect(config.connectors.rethinkdb({
            config: baseConfig,
            env
        }));
    }
    return r.connect(baseConfig);
});
//# sourceMappingURL=index.js.map