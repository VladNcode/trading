import { Hono } from 'hono';
import { getTickers, toggleFavorites } from '../controllers/tickers.js';

export const tickers = new Hono();

tickers.get('/', getTickers);
tickers.patch('/favorites', toggleFavorites);
