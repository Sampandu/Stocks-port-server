const axios = require('axios');
const { testToken } = process.env || require('../secret');

const fetchPrice = (req, res, ticker) => {
  return axios
    .get(
      `https://sandbox.iexapis.com/v1/stock/${ticker}/price?token=${testToken}`
    )
    .then(response => {
      return response.data;
    })
    .catch(err => console.log('Oops, there is error in fetching price', err));
};

const fetchSupportedTickers = (req, res) => {
  return axios
    .get(`https://sandbox.iexapis.com/beta/ref-data/symbols?token=${testToken}`)
    .then(response => response.data)
    .then(tickers => {
      const tickersList = tickers.map(stock => stock.symbol);
      return res.json(tickersList);
    })
    .catch(err =>
      console.log('Oops, there is error in fetching supported tickers', err)
    );
};

module.exports = { fetchPrice, fetchSupportedTickers };
