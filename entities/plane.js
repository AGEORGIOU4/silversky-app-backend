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

async function init() {
  await db.sync();
}

async function createPlanes() {
  const count = await Plane.count({});

  if (count === 0) {
    await Plane.create({ id: 1, color: "white" });
    await Plane.create({ id: 2, color: "white" });
    await Plane.create({ id: 3, color: "white" });
  } else {
    console.log("Values already exist");
  }
}

init();
createPlanes();

module.exports = Plane;