import * as r from 'rethinkdb';
import { getConfig } from '../../src/utils/getConfig';

export const rethinkdb = async (env: any): Promise<any> => {
  let baseConfig = {
    db: env.RETHINK_DB || 'test',
    user: env.RETHINK_USER || 'admin',
    pass: env.RETHINK_PASS || '',
    host: env.RETHINK_HOST || 'localhost',
    port: env.RETHINK_PORT || 28015
  };

  const config = await getConfig(env.BASE_PATH || '');

  if (
    'connectors' in config &&
    'rethinkdb' in config.connectors &&
    typeof config.connectors.rethinkdb === 'function'
  ) {
    return r.connect(
      config.connectors.rethinkdb({
        config: baseConfig,
        env
      })
    );
  }

  return r.connect(baseConfig);
};
