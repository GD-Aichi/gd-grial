"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const querystring_1 = require("querystring");
exports.rest = async ({ REST_ENDPOINT }) => {
    return {
        async create({ resource, data, params = {}, headers = {} }) {
            if (!data) {
                throw new ReferenceError('The data is required');
            }
            const qs = querystring_1.stringify(params);
            const URL = `${REST_ENDPOINT}/${resource}/?${qs}`;
            const response = await node_fetch_1.default(URL, {
                method: 'POST',
                headers: Object.assign({
                    'Content-Type': 'application/json'
                }, headers),
                body: JSON.stringify(data)
            });
            return response.json();
        },
        async read({ resource, id = null, params = {}, headers = {} }) {
            const qs = querystring_1.stringify(params);
            const URL = id
                ? `${REST_ENDPOINT}/${resource}/${id}?${qs}`
                : `${REST_ENDPOINT}/${resource}?${qs}`;
            const response = await node_fetch_1.default(URL, {
                method: 'GET',
                headers: headers
            });
            return response.json();
        },
        async update({ resource, id, data, params = {}, headers = {} }) {
            if (!data) {
                throw new ReferenceError('The data is required');
            }
            const URL = `${REST_ENDPOINT}/${resource}/${id}/`;
            const response = await node_fetch_1.default(URL, {
                method: 'PUT',
                headers: Object.assign({
                    'Content-Type': 'application/json'
                }, headers),
                body: JSON.stringify(data)
            });
            return response.json();
        },
        async delete({ resource, id = null, params = {}, headers = {} }) {
            const qs = querystring_1.stringify(params);
            const URL = id
                ? `${REST_ENDPOINT}/${resource}/${id}?${qs}`
                : `${REST_ENDPOINT}/${resource}?${qs}`;
            const response = await node_fetch_1.default(URL, {
                method: 'DELETE',
                headers: headers
            });
            return response.json();
        }
    };
};
//# sourceMappingURL=index.js.map