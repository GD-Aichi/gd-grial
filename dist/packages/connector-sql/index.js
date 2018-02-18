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
const sequelize_typescript_1 = require("sequelize-typescript");
const getConfig_1 = require("../../utils/getConfig");
exports.sqldb = (env) => __awaiter(this, void 0, void 0, function* () {
    const baseConfig = {
        database: env.SQL_DB || 'test',
        username: env.SQL_USER || 'root',
        password: env.SQL_PASS || 'root',
        host: env.SQL_HOST || 'localhost',
        port: env.SQL_PORT || 3306
    };
    const config = yield getConfig_1.getConfig(env.BASE_PATH || '');
    if (config &&
        config.connectors &&
        config.connectors.sqldb) {
        if (typeof config.connectors.sqldb === 'function') {
            return new sequelize_typescript_1.Sequelize(config.connectors.sqldb({
                config: baseConfig,
                env
            }));
        }
        else if (config.connectors.sqldb) {
            return new sequelize_typescript_1.Sequelize(Object.assign({}, config.connectors.sqldb, {
                modelPaths: [
                    `${env.BASE_PATH}/models`
                ]
            }));
        }
    }
    return new sequelize_typescript_1.Sequelize(Object.assign({}, baseConfig, {
        modelPaths: [
            `${env.BASE_PATH}/models`
        ]
    }));
});
//# sourceMappingURL=index.js.map