const { fetchPrice, fetchSupportedTickers } = require('./handleAPIcall');

const handleOrder = (req, res, db) => {
  let { name, ticker, quantity } = req.body;
  ticker = ticker.toUpperCase();

  //quantity validation
  if (!Number.isInteger(quantity)) {
    return res
      .json('Please enter whole number quantities of shares')
      .status(400);
  }

  //ticker validation
  fetchSupportedTickers(ticker)
    .then(result => {
      return !result && res.json('Please enter valid ticker').status(400);
    })
    .catch(err =>
      console.log('Oops, there is error in fetching supported tickers', err)
    );

  const makeOrder = async () => {
    try {
      const price = await fetchPrice(req, res, ticker);

      // write data into db (both tables of portfolio and transaction)
      db.select('quantity')
        .from('portfolio')
        .where({
          name: name,
          ticker: ticker,
        })
        .then(data => {
          // check if the ticker exits in portfolio or not
          if (data.length === 0) {
            return db
              .transaction(trx => {
                trx
                  .insert({ name, ticker, quantity })
                  .into('portfolio')
                  .returning('*')
                  .then(data => {
                    return trx('transaction')
                      .returning('*')
                      .insert({
                        name: data[0].name,
                        ticker: data[0].ticker,
                        quantity: Number(data[0].quantity),
                        price: price,
                      })
                      .then(tx => res.json(tx[0]));
                  })
                  .then(trx.commit)
                  .catch(trx.rollback);
              })
              .catch(err => {
                console.log(err);
                res.status(400).json('unable to process this order');
              });
          } else {
            return db
              .transaction(trx => {
                trx('portfolio')
                  .where({
                    name: name,
                    ticker: ticker,
                  })
                  .increment('quantity', quantity)
                  .returning('*')
                  .then(data => {
                    return trx('transaction')
                      .returning('*')
                      .insert({
                        name: data[0].name,
                        ticker: ticker,
                        quantity: quantity,
                        price: price,
                      })
                      .then(tx => res.json(tx[0]));
                  })
                  .then(trx.commit)
                  .catch(trx.rollback);
              })
              .catch(err => {
                console.log(err);
                res.status(400).json('unable to process this order');
              });
          }
        })
        .catch(err => {
          console.log(err);
          res.status(400).json('unable to handle this order');
        });
    } catch (error) {
      console.log('Oops, there is error in order route', error);
    }
  };

  makeOrder();
};

module.exports = { handleOrder };
