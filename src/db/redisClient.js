import { createClient } from 'redis';
import { pinoLogger } from '../utils/logger.js';

export const redisClient = createClient({ url: process.env.REDIS_URL }).on('error', err =>
  console.log('Redis Client Error', err),
);

redisClient.connect().then(() => {
  pinoLogger.info('Connected to Redis');
});
