const handlePortfolio = (req, res, db) => {
  const { name } = req.body

  db.select('*')
    .from('portfolio')
    .where('name', '=', name)
    .then(data => {
      if (data.length === 0) {
        return res.status(200).json('Your portfolio is empty')
      } else {
        return res.status(200).json(data)
      }
    })
    .catch(err => res.status(400).json('unable to show the portfolio'))
}

module.exports = { handlePortfolio }
