import { createClient, RedisClient } from 'redis';

export const redis = async ({ REDIS_HOST = 'localhost', REDIS_PORT = 6379 }: any): Promise<RedisClient> => {
  return createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
  });
};
