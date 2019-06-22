const config = {
  host: '127.0.0.1',
  user: '',
  password: '',
  database: '',
  charset: 'utf8',
};

var db = require('knex')({
  client: 'pg',
  connection: config,
});

db.raw('CREATE DATABASE TTP-FS;')
  .then(function() {
    db.destroy();

    config.database = 'ttp-fs';
    db = require('knex')({ client: 'pg', connection: config });

    db.schema
      .createTable('users', table => {
        table.increments('id');
        table.string('name');
        table.string('email').notNullable();
        table.float('balance', 2).defaultTo(0.0);
        table.timestamp('joined');
      })
      .then(() => console.log('table users is created'))
      .catch(err => {
        console.log(err);
        throw err;
      })
      .finally(() => {
        db.destroy();
      });

    db.schema
      .createTable('login', table => {
        table.increments('id');
        table.string('hash').notNullable();
        table.string('email').notNullable();
      })
      .then(() => console.log('table login is created'))
      .catch(err => {
        console.log(err);
        throw err;
      })
      .finally(() => {
        db.destroy();
      });

    db.schema
      .createTable('portfolio', table => {
        table.increments('id');
        table.string('name');
        table.string('ticker').notNullable();
        table.bigint('quantity').defaultTo(0);
      })
      .then(() => console.log('table portfolio is created'))
      .catch(err => {
        console.log(err);
        throw err;
      })
      .finally(() => {
        db.destroy();
      });

    db.schema
      .createTable('transaction', table => {
        table.increments('id');
        table.string('name');
        table.string('ticker').notNullable();
        table.bigint('quantity').defaultTo(0);
        table.float('price', 2).defaultTo(0.0);
      })
      .then(() => console.log('table transaction is created'))
      .catch(err => {
        console.log(err);
        throw err;
      })
      .finally(() => {
        db.destroy();
      });
  })
  .finally(function() {
    console.log('database is create');
  });
