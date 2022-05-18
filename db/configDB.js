const { Sequelize } = require('sequelize');

module.exports = new Sequelize('heroku_f0452a30245fcc8', 'b3597e0e0cf48a', '59c0ea5d', {
  host: 'us-cdbr-east-05.cleardb.net',
  dialect: 'mysql'
});