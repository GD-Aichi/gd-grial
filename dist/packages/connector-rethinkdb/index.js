"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("rethinkdb");
const getConfig_1 = require("../../utils/getConfig");
exports.rethinkdb = async (env) => {
    let baseConfig = {
        db: env.RETHINK_DB || 'test',
        user: env.RETHINK_USER || 'admin',
        pass: env.RETHINK_PASS || '',
        host: env.RETHINK_HOST || 'localhost',
        port: env.RETHINK_PORT || 28015
    };
    const config = await getConfig_1.getConfig(env.BASE_PATH || '');
    if ('connectors' in config &&
        'rethinkdb' in config.connectors &&
        typeof config.connectors.rethinkdb === 'function') {
        return r.connect(config.connectors.rethinkdb({
            config: baseConfig,
            env
        }));
    }
    return r.connect(baseConfig);
};
//# sourceMappingURL=index.js.map