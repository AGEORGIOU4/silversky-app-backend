const { DataTypes } = require('sequelize')
const db = require('../db/configDB')

const Player = db.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  x: {
    type: DataTypes.REAL,
    allowNull: true,
  },
  y: {
    type: DataTypes.REAL,
    allowNull: true,
  },
  z: {
    type: DataTypes.REAL,
    allowNull: true,
  }
}, {
  tableName: 'player',
  timestamps: false
});

async function init() {
  await db.sync();
}

async function createPlayer() {
  const count = await Plane.count({});

  console.log(count);
  if (count === 0) {
    await Plane.create({ id: 1, x: 1, y: 0, z: 0 });
  } else {
    console.log("Player already exist");
  }
}

init();
createPlayer();

module.exports = Player;