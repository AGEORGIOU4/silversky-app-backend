const { DataTypes } = require('sequelize')
const db = require('../db/configDB')

const Player = db.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  x: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  y: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  z: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'player',
  timestamps: false
});

async function init() {
  await db.sync();
}

init();

module.exports = Player;