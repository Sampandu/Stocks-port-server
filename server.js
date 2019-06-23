const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const { handleRegister } = require('./controllers/register');
const { handleSignin } = require('./controllers/signin');
const { handleOrder, getBalance } = require('./controllers/order');
const { handlePortfolio } = require('./controllers/portfolio');
const { handleTransaction } = require('./controllers/transaction');
const { fetchSupportedTickers } = require('./controllers/handleAPIcall');
const PORT = process.env.PORT || 3001;

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt));
app.post('/signin', (req, res) => handleSignin(req, res, db, bcrypt));
app.post('/order', (req, res) => handleOrder(req, res, db));
app.get('/portfolio', (req, res) => handlePortfolio(req, res, db));
app.get('/transaction', (req, res) => handleTransaction(req, res, db));
app.get('/tickersList', (req, res) => fetchSupportedTickers(req, res));
app.get('/balance', (req, res) => getBalance(req, res, db));

app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});
