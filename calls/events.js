const express = require('express');
const router = express.Router();

const db = require('../db/configDB');

const Player = require('../entities/Player')
const Plane = require('../entities/Plane')

// Add headers to allow API calls before the routes are defined
router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});


/*-----------PLAYER------------*/

router.get('/player', (req, res) => {
  Player.findAll()
    .then(player => {
      return res.status(200)
        .setHeader('content-type', 'application/json')
        .send(clients); // body is JSON
    })
    .catch(error => {
      return res.status(500)
        .setHeader('content-type', 'application/json')
        .send({ error: `Server error: ${error.name}` });
    });
});


module.exports = router;