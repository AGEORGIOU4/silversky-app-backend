const { Sequelize } = require('sequelize');

module.exports = new Sequelize('heroku_bdc773ffff2c04e', 'b8cfb0486a3071', 'ae170347', {
  host: 'us-cdbr-east-05.cleardb.net',
  dialect: 'mysql'
});