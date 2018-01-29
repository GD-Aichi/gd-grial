import * as fetch from 'node-fetch';
import { stringify } from 'querystring';

export const rest = async ({ REST_ENDPOINT }: any): Promise<any> => {
  return {
    async create({ resource, data, params = {}, headers = {} }: any) {
      if (!data) {
        throw new ReferenceError('The data is required');
      }

      const qs = stringify(params);

      const URL = `${REST_ENDPOINT}/${resource}/?${qs}`;

      const response = await fetch(URL, {
        method: 'POST',
        headers: Object.assign(
          {
            'Content-Type': 'application/json'
          },
          headers
        ),
        body: JSON.stringify(data)
      });

      return response.json();
    },

    async read({ resource, id = null, params = {}, headers = {} }: any) {
      const qs = stringify(params);

      const URL = id
        ? `${REST_ENDPOINT}/${resource}/${id}?${qs}`
        : `${REST_ENDPOINT}/${resource}?${qs}`;

      const response = await fetch(URL, {
        method: 'GET',
        headers: headers
      });

      return response.json();
    },

    async update({ resource, id, data, params = {}, headers = {} }: any) {
      if (!data) {
        throw new ReferenceError('The data is required');
      }

      const URL = `${REST_ENDPOINT}/${resource}/${id}/`;

      const response = await fetch(URL, {
        method: 'PUT',
        headers: Object.assign(
          {
            'Content-Type': 'application/json'
          },
          headers
        ),
        body: JSON.stringify(data)
      });

      return response.json();
    },

    async delete({ resource, id = null, params = {}, headers = {} }: any) {
      const qs = stringify(params);

      const URL = id
        ? `${REST_ENDPOINT}/${resource}/${id}?${qs}`
        : `${REST_ENDPOINT}/${resource}?${qs}`;

      const response = await fetch(URL, {
        method: 'DELETE',
        headers: headers
      });

      return response.json();
    }
  };
};
