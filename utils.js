const createTickersList = portfolio => {
  return portfolio
    .map(e => e.ticker.trim())
    .join(',')
    .toLowerCase();
};

module.exports = { createTickersList };
