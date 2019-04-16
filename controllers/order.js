const { fetchPrice } = require('./handleAPIcall')

const handleOrder = (req, res, db) => {
  let { name, ticker, quantity } = req.body
  ticker = ticker.toUpperCase()

  //input validation
  if (!Number.isInteger(quantity)) {
    return res.status(400).json('incorrect form submittion')
  }

  const makeOrder = async () => {
    try {
      const price = await fetchPrice(req, res, ticker)

      //check if the ticker exits or not
      if(typeof price === 'string') {
        res.status(400).json('unknown ticker')
      } else {
        // write data into db (both tables of portfolio and transaction)
        db.select('quantity')
          .from('portfolio')
          .where({
            name: name,
            ticker: ticker
          })
          .then(data => {
            // check if a user's portfolio is empty or not
            if(data.length === 0) {
              return db.transaction(trx => {
                      trx.insert({name, ticker, quantity})
                        .into('portfolio')
                        .returning('*')
                        .then(data => {
                          console.log('1', data[0])
                          return trx('transaction')
                                  .returning('*')
                                  .insert({
                                    name: data[0].name,
                                    ticker: data[0].ticker,
                                    quantity: Number(data[0].quantity),
                                    price: price
                                  })
                                  .then(tx => res.json(tx[0]))
                        })
                        .then(trx.commit)
                        .catch(trx.rollback)
                    })
                    .catch(err => res.status(400).json('unable to process this order'))
            } else {
              return db.transaction(trx => {
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
                                    price: price
                                  })
                                  .then(tx => res.json(tx[0]))
                        })
                        .then(trx.commit)
                        .catch(trx.rollback)
                    })
                    .catch(err => res.status(400).json('unable to process this order'))
            }
          })
          .catch(err => res.status(400).json('unable to handle this order'))
      }
      } catch(error) {
        console.log(error)
      }
  }

  makeOrder()
}

module.exports = { handleOrder }

