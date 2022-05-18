const { DataTypes } = require('sequelize')
const db = require('../db/configDB')

const Plane = db.define('Plane', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'plane',
  timestamps: false
});

async function addPlaneValues() {
  try {
    Plane.create({ id: 1, color: 'white' });
    Plane.create({ id: 2, color: 'white' });
    Plane.create({ id: 3, color: 'white' });
  } catch (err) {
    console.log(err);
  }
}

async function init() {
  await db.sync();

  try {
    addPlaneValues();
  } catch (err) {
    console.log(err);
  }
}


init();

module.exports = Plane;