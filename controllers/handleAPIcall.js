const axios = require('axios');

const fetchPrice = (req, res, ticker) => {
  return axios.get(`https://api.iextrading.com/1.0/stock/${ticker}/price`)
          .then(response => {
            return typeof response.data === 'number' ? response.data : 'unknown ticker'
          })
          .catch(err => console.log(err))
}

module.exports = { fetchPrice }
