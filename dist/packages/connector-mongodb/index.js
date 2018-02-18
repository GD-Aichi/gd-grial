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
const MongoClient = require("mongodb");
const connectionsCache = {};
exports.mongodb = ({ MONGO_USER, MONGO_PASS, MONGO_HOST = 'localhost', MONGO_NAME, MONGO_URL = null }) => __awaiter(this, void 0, void 0, function* () {
    const URL = MONGO_URL ||
        `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_NAME}`;
    if (!connectionsCache[URL]) {
        connectionsCache[URL] = new Promise(function (resolve, reject) {
            MongoClient.connect(URL, (error, connection) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                resolve(connection);
            });
        });
    }
    return connectionsCache[URL];
});
//# sourceMappingURL=index.js.map