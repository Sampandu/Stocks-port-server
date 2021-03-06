const { createTickersList } = require('../utils');
const axios = require('axios');
const { testToken } = process.env || require('../secret');

const handlePortfolio = (req, res, db) => {
  const name = req.query.name;

  db.select('*')
    .from('portfolio')
    .where('name', '=', name)
    .then(portfolio => {
      if (portfolio.length === 0) {
        return res.status(200).json([]);
      } else {
        const tickersList = createTickersList(portfolio);
        //get the open price and latest price of each stock listed in the portfolio by using IEX API
        axios
          .get(
            `https://sandbox.iexapis.com/v1/stock/market/batch?token=${testToken}&symbols=${tickersList}&types=quote`
          )
          .then(response => response.data)
          .then(data => {
            if (Object.keys(data).length !== 0) {
              const updatedPortofolio = portfolio.map(stock => {
                stock.open = data[stock.ticker].quote.open;
                stock.latest = data[stock.ticker].quote.latestPrice;
                return stock;
              });
              return res.status(200).json(updatedPortofolio);
            }
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(400).json('Ooops, unable to show the portfolio');
    });
};

module.exports = { handlePortfolio };
