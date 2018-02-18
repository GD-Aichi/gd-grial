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
const node_fetch_1 = require("node-fetch");
const querystring_1 = require("querystring");
exports.rest = ({ REST_ENDPOINT }) => __awaiter(this, void 0, void 0, function* () {
    return {
        create({ resource, data, params = {}, headers = {} }) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!data) {
                    throw new ReferenceError('The data is required');
                }
                const qs = querystring_1.stringify(params);
                const URL = `${REST_ENDPOINT}/${resource}/?${qs}`;
                const response = yield node_fetch_1.default(URL, {
                    method: 'POST',
                    headers: Object.assign({
                        'Content-Type': 'application/json'
                    }, headers),
                    body: JSON.stringify(data)
                });
                return response.json();
            });
        },
        read({ resource, id = null, params = {}, headers = {} }) {
            return __awaiter(this, void 0, void 0, function* () {
                const qs = querystring_1.stringify(params);
                const URL = id
                    ? `${REST_ENDPOINT}/${resource}/${id}?${qs}`
                    : `${REST_ENDPOINT}/${resource}?${qs}`;
                const response = yield node_fetch_1.default(URL, {
                    method: 'GET',
                    headers: headers
                });
                return response.json();
            });
        },
        update({ resource, id, data, params = {}, headers = {} }) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!data) {
                    throw new ReferenceError('The data is required');
                }
                const URL = `${REST_ENDPOINT}/${resource}/${id}/`;
                const response = yield node_fetch_1.default(URL, {
                    method: 'PUT',
                    headers: Object.assign({
                        'Content-Type': 'application/json'
                    }, headers),
                    body: JSON.stringify(data)
                });
                return response.json();
            });
        },
        delete({ resource, id = null, params = {}, headers = {} }) {
            return __awaiter(this, void 0, void 0, function* () {
                const qs = querystring_1.stringify(params);
                const URL = id
                    ? `${REST_ENDPOINT}/${resource}/${id}?${qs}`
                    : `${REST_ENDPOINT}/${resource}?${qs}`;
                const response = yield node_fetch_1.default(URL, {
                    method: 'DELETE',
                    headers: headers
                });
                return response.json();
            });
        }
    };
});
//# sourceMappingURL=index.js.map