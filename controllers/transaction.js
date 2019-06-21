const handleTransaction = (req, res, db) => {
  const name = req.query.name;

  db.select('*')
    .from('transaction')
    .where('name', '=', name)
    .then(data => {
      if (data.length === 0) {
        return res.status(200).json([]);
      } else {
        return res.status(200).json(data);
      }
    })
    .catch(err => res.status(400).json('Oops, unable to show the transaction'));
};

module.exports = { handleTransaction };
