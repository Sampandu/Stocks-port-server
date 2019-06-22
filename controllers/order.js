const { fetchPrice } = require('./handleAPIcall');

const handleOrder = (req, res, db) => {
  let { name, ticker, quantity } = req.body;
  ticker = ticker.toUpperCase();

  const makeOrder = async () => {
    try {
      const price = await fetchPrice(req, res, ticker);
      const orderValue = Number(price) * Number(quantity).toFixed(2);

      db.select('balance')
        .from('users')
        .where({ name: name })
        .then(data => {
          //check if user has enough cash for a given purchase
          const difference = data[0].balance - orderValue;
          if (difference <= 0) {
            return res.json('not enough cash');
          } else {
            // write data into db (the tables of users, portfolio and transaction)
            db.select('quantity')
              .from('portfolio')
              .where({
                name: name,
                ticker: ticker,
              })
              .then(result => {
                // check if the ticker exits in portfolio or not
                if (result.length === 0) {
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
                            .then(data => {
                              return trx('users')
                                .where({ name: name })
                                .decrement({ balance: orderValue })
                                .returning('*')
                                .then(tx => res.send(tx[0]))
                                .catch(err => console.log('11111', err));
                            })
                            .catch(err => console.log('22222', err));
                        })
                        .then(trx.commit)
                        .catch(trx.rollback);
                    })
                    .catch(err => {
                      console.log('33333', err);
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
                            .then(data => {
                              return trx('users')
                                .where({ name: name })
                                .decrement({ balance: orderValue })
                                .returning('*')
                                .then(tx => res.send(tx[0]))
                                .catch(err => console.log('44444', err));
                            })
                            .catch(err => console.log('55555', err));
                        })
                        .then(trx.commit)
                        .catch(trx.rollback);
                    })
                    .catch(err => {
                      console.log('666666', err);
                      res.status(400).json('unable to process this order');
                    });
                }
              })
              .catch(err => {
                console.log('77777', err);
                res.status(400).json('unable to handle this order');
              });
          }
        })
        .catch(err => {
          console.log('88888', err);
          res.status(400).json('unable to handle this order');
        });
    } catch (error) {
      console.log('Oops, there is error in order route', error);
    }
  };

  makeOrder();
};

const getBalance = (req, res, db) => {
  const name = req.query.name;

  db.select('balance')
    .from('users')
    .where('name', '=', name)
    .then(result => res.json(result[0].balance).status(200))
    .catch(err => {
      console.log(err);
      res.status(400).json('Ooops, unable to get the balance');
    });
};

module.exports = { handleOrder, getBalance };
