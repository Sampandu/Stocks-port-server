const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const knex = require('knex')
const bcrypt = require('bcrypt-nodejs')

const { handleRegister } = require('./controllers/register')

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user:'',
    password:'',
    database:'ttp-fs'
  }
})

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt))

app.listen(3001, () => {
  console.log('The server is listening on port 3001')
})
