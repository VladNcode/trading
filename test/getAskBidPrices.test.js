import assert from 'node:assert';
import { describe, it } from 'node:test';
import { getAskBidPrices } from '../src/utils/bignumber.js';

describe('getAskBidPrices function', () => {
  it('should calculate asks and bids correctly', () => {
    const table = [
      { price: 0.11169, ask: 0.1172745, bid: 0.1061055 },
      { price: 0.05512, ask: 0.057876, bid: 0.052364 },
      { price: 0.99939, ask: 1.0493595, bid: 0.9494205 },
      { price: 354.0, ask: 371.7, bid: 336.3 },
      { price: 0.11, ask: 0.1155, bid: 0.1045 },
      { price: 2.0, ask: 2.1, bid: 1.9 },
      { price: 0.01632, ask: 0.017136, bid: 0.015504 },
      { price: 0.17861, ask: 0.1875405, bid: 0.1696795 },
      { price: 174.999, ask: 183.74895, bid: 166.24905 },
      { price: 0.027151, ask: 0.02850855, bid: 0.02579345 },
      { price: 29.0, ask: 30.45, bid: 27.55 },
      { price: 1, ask: 1.05, bid: 0.95 },
    ];

    for (const row of table) {
      const { ask, bid } = getAskBidPrices(row.price);
      assert.strictEqual(ask.toString(), row.ask.toString());
      assert.strictEqual(bid.toString(), row.bid.toString());
    }
  });
});
