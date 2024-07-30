import { redisClient } from '../db/redisClient.js';
import { getAskBidPrices } from '../utils/bignumber.js';

export const getTickers = async c => {
  const [apiCache, favoritesData] = await Promise.all([redisClient.get('ticker-data'), redisClient.get('favorites')]);

  let apiData;

  if (apiCache) {
    apiData = JSON.parse(apiCache);
  } else {
    const response = await fetch('https://testnet.binancefuture.com/fapi/v1/ticker/price');
    apiData = await response.json();
    await redisClient.setEx('ticker-data', 60, JSON.stringify(apiData));
  }

  const favorites = favoritesData ? JSON.parse(favoritesData) : {};
  const res = { all: [], favorites: [] };

  for (const ticker of apiData) {
    const { ask, bid } = getAskBidPrices(ticker.price);
    const tickerData = { ...ticker, ask, bid };

    if (favorites[ticker.symbol]) res.favorites.push(tickerData);
    else res.all.push(tickerData);
  }

  return c.json(res);
};

export const toggleFavorites = async c => {
  const [{ symbol, action }, favoritesData] = await Promise.all([c.req.json(), redisClient.get('favorites')]);

  const favorites = favoritesData ? JSON.parse(favoritesData) : {};

  if (action === 'add') favorites[symbol] = true;
  else delete favorites[symbol];

  await redisClient.set('favorites', JSON.stringify(favorites));

  return c.json({ success: true });
};
