import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { redisClient } from './db/redisClient.js';
import { tickers } from './routes/tickers.js';
import { pinoLogger } from './utils/logger.js';

const app = new Hono();

app.use(secureHeaders());
app.use(logger());

app.route('/api/tickers', tickers);
app.get('/static/*', serveStatic({ root: './' }));

const port = process.env.PORT || 3000;
export const server = serve({ fetch: app.fetch, port });

pinoLogger.info(`Server is running on port ${port}...`);

const shutdown =
  (code = 0) =>
  async () => {
    pinoLogger.fatal('Shutting down');
    await redisClient.quit();
    server.close();
    process.exit(code);
  };

process.on('uncaughtException', shutdown(1));
process.on('unhandledRejection', shutdown(1));
process.on('SIGINT', shutdown(0));
process.on('SIGTERM', shutdown(0));
