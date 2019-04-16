const handleSignin = (req, res, db, bcrypt) => {
  const {email, password} = req.body

  //input validation
  if (!email || !password) {
    return res.status(400).json('incorrect form submittion')
  }

  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if(isValid) {
        return db.select('*')
                  .from('users')
                  .where('email', '=', email)
                  .then(user => res.status(200).json(user[0]))
      } else {
        res.status(400).json('unable to login')
      }
    })
    .catch(err => res.status(400).json('unable to login'))
}

module.exports = { handleSignin }
