import { RedisClient } from 'redis';
export declare const redis: ({ REDIS_HOST, REDIS_PORT }: any) => Promise<RedisClient>;
