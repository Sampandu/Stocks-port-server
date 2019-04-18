const handleTransaction = (req, res, db) => {
  const { name } = req.query

  db.select('*')
    .from('transaction')
    .where('name', '=', name)
    .then(data => {
        return res.status(200).json(data)
    })
    .catch(err => res.status(400).json('unable to show the transaction'))
}

module.exports = { handleTransaction }
