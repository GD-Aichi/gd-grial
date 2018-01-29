import { Sequelize } from 'sequelize-typescript';
import { getConfig } from '../utils/getConfig';

export const sqldb = async (env: any): Promise<Sequelize> => {
  const baseConfig = {
    db: env.SQL_DB || 'test',
    user: env.SQL_USER || 'root',
    pass: env.SQL_PASS || 'root',
    host: env.SQL_HOST || 'localhost',
    port: env.SQL_PORT || 3306
  };

  const config = await getConfig(env.BASE_PATH || '');

  if (
    config &&
    config.connectors &&
    config.connectors.sqldb
  ) {
    if (typeof config.connectors.sqldb === 'function') {
      return new Sequelize(
        config.connectors.sqldb({
          config: baseConfig,
          env
        })
      );
    } else if (config.connectors.sqldb) {
      return new Sequelize({
        ...config.connectors.sqldb,
        ... {
          modelPaths: [
            `${env.BASE_PATH}/models`
          ]
        }
      });
    }
  }

  return new Sequelize(baseConfig);
};
