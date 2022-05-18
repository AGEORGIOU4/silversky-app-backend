const { DataTypes } = require('sequelize')
const db = require('../db/configDB')

const Plane = db.define('Plane', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'plane',
  timestamps: false
});

async function init() {
  await db.sync();
}

init();

module.exports = Plane;