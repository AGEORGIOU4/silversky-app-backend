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

// Get player coordinates
router.get('/playercords/:id', (req, res) => {
  const { id } = req.params;

  Player.findOne({ where: { id: id } })
    .then(player => {
      if (!player) {
        return res.status(404)
          .setHeader('content-type', 'application/json')
          .send({ error: `Player not found for  id: ${id}!` });
      }

      // player found
      return res.status(200)
        .setHeader('content-type', 'application/json')
        .send(player); // body is JSON
    })
    .catch(error => {
      res.status(500)
        .setHeader('content-type', 'application/json')
        .send({ error: `Server error: ${error.name}` });
    });
});

// Update player coordinates
router.put('/playercords/:id', (req, res) => {
  const { id } = req.params; // get id from params
  const posted_cords = req.body; // submitted cords

  return db.transaction(async (t) => {
    if (isNaN(id)) {
      return res.status(422)
        .setHeader('content-type', 'application/json')
        .send({ error: `ID is non-numeric!` });
    }

    const player = await Player.findOne({ where: { id: id } })

    if (!player) { // player not found
      return res.status(404)
        .setHeader('content-type', 'application/json')
        .send({ error: `Player with id ${id} not found!` });
    }

    // player found
    if (posted_cords.x)
      player.x = posted_cords.x;

    if (posted_cords.y)
      player.y = posted_cords.y;

    if (posted_cords.z)
      player.z = posted_cords.z;

    return player.save({ transaction: t })
      .then(player => {
        res.status(200)
          .setHeader('content-type', 'application/json')
          .send({ message: `Player cords updated!`, player: player }); // body is JSON
      })
      .catch(error => {
        res.status(409)
          .setHeader('content-type', 'application/json')
          .send({ error: { error } }); // resource already exists
      });
  })
    .catch(error => {
      res.status(500)
        .setHeader('content-type', 'application/json')
        .send({ error: `Server error: ${error.name}` });
    });
});

/*-----------PLANE------------*/

// Get plane color
router.get('/plane/:id', (req, res) => {
  const { id } = req.params;

  Plane.findOne({ where: { id: id } })
    .then(plane => {
      if (!plane) {
        return res.status(404)
          .setHeader('content-type', 'application/json')
          .send({ error: `Plane not found for  id: ${id}!` });
      }

      // plane found
      return res.status(200)
        .setHeader('content-type', 'application/json')
        .send(plane); // body is JSON
    })
    .catch(error => {
      res.status(500)
        .setHeader('content-type', 'application/json')
        .send({ error: `Server error: ${error.name}` });
    });
});

// Update plane color
router.put('/plane/:id', (req, res) => {
  const { id } = req.params; // get id from params
  const posted_color = req.body; // submitted color

  return db.transaction(async (t) => {
    if (isNaN(id)) {
      return res.status(422)
        .setHeader('content-type', 'application/json')
        .send({ error: `ID is non-numeric!` });
    }

    const plane = await Plane.findOne({ where: { id: id } })

    if (!plane) { // plane not found
      return res.status(404)
        .setHeader('content-type', 'application/json')
        .send({ error: `Plane with id ${id} not found!` });
    }

    // plane found
    if (posted_color.color)
      plane.color = posted_color.color

    return plane.save({ transaction: t })
      .then(plane => {
        res.status(200)
          .setHeader('content-type', 'application/json')
          .send({ message: `Plane color updated!`, plane: plane }); // body is JSON
      })
      .catch(error => {
        res.status(409)
          .setHeader('content-type', 'application/json')
          .send({ error: { error } }); // resource already exists
      });
  })
    .catch(error => {
      res.status(500)
        .setHeader('content-type', 'application/json')
        .send({ error: `Server error: ${error.name}` });
    });
});


module.exports = router;