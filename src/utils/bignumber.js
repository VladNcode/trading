import BigNumber from 'bignumber.js';

const askPercentage = new BigNumber(1.05);
const bidPercentage = new BigNumber(0.95);

export const getAskBidPrices = price => {
  const bnPrice = new BigNumber(price);
  const ask = bnPrice.multipliedBy(askPercentage);
  const bid = bnPrice.multipliedBy(bidPercentage);

  return { ask, bid };
};
