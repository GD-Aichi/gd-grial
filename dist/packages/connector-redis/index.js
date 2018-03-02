"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
exports.redis = async ({ REDIS_HOST = 'localhost', REDIS_PORT = 6379 }) => {
    return redis_1.createClient({
        host: REDIS_HOST,
        port: REDIS_PORT
    });
};
//# sourceMappingURL=index.js.map