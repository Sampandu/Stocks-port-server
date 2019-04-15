const handleOrder = (req, res, db) => {
  const { name, ticker, quantity, price } = req.body

  //input validation
  if (!Number.isInteger(quantity)) {
    return res.status(400).json('incorrect form submittion')
  }

  db.select('quantity')
    .from('portfolio')
    .where({
      name: name,
      ticker: ticker
    })
    .then(data => {
      console.log('0', data)
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
                    console.log('2', data[0])
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

module.exports = { handleOrder }

