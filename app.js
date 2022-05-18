const sqlite3 = require('sqlite3').verbose();
const express = require('express');

const events = require('./calls/events')

const db = require('./db/configDB');

const app = express();
const port = 3000;

app.use(express.json());
const PORT = process.env.PORT || 5000

const bodyParser = require('body-parser');
app.use(bodyParser.json())

// Test DB
db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err))

// Welcome Message
app.get("/", (req, res) => { res.send("Silversky Teleports app backend") })

// Calls
app.use('/', events)


app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})


let db = new sqlite3.Database("./db/assignment.db", (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the file-based SQlite database.');
});
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS playerLoc(playerid INTEGER PRIMARY KEY, x REAL NOT NULL, y REAL NOT NULL, z REAL NOT NULL)');
    db.run('CREATE TABLE IF NOT EXISTS planeColor(planeid INTEGER PRIMARY KEY, color TEXT NOT NULL)');
    db.run("INSERT INTO playerLoc(playerid,x,y,z) VALUES (?,?,?,?)", ["1", "0", "0", "0"], function (err) {
        if (err) {
            console.log("Already exists");
        } else {
            console.log("PlayerCords Added!");
        }
    });
    db.run("INSERT INTO planeColor(planeid,color) VALUES (?,?)", ["1", "white"], function (err) {
        if (err) {
            console.log("Already exists");
        } else {
            console.log("Plane 1 Added!");
        }
    });
    db.run("INSERT INTO planeColor(planeid,color) VALUES (?,?)", ["2", "white"], function (err) {
        if (err) {
            console.log("Already exists");
        } else {
            console.log("Plane 2 Added!");
        }
    });
    db.run("INSERT INTO planeColor(planeid,color) VALUES (?,?)", ["3", "white"], function (err) {
        if (err) {
            console.log("Already exists");
        } else {
            console.log("Plane 3 Added!");
        }
    });
});
//Get playercords
app.get('/silversky/playercords/get/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    db.get('SELECT * FROM playerLoc WHERE playerid=?', [id], (err, row) => {
        if (!row) {
            res.status(404)
                .setHeader('content-type', 'application/json')
                .send({ error: "Player was not found!" });
        } else {
            res.status(200)
                .setHeader('content-type', 'application/json')
                .send({ id: `${row.playerid}`, x: `${row.x}`, y: `${row.y}`, z: `${row.z}` });
        }
    });

});

//Edit playercords
app.put('/silversky/playercords/update/:id', (req, res) => {
    const { id } = req.params; // get id from params
    const posted_cords = req.body; // submitted module
    console.log(posted_cords.x, posted_cords.y, posted_cords.z)
    db.run(`UPDATE playerLoc SET x=?, y=?,z=? WHERE playerid=?`,
        [posted_cords.x, posted_cords.y, posted_cords.z, id], (err) => {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    res.status(422)
                        .setHeader('content-type', 'application/json')
                        .send({ error: "Something went wrong: " + err.message });
                } else { // other server-side error
                    res.status(500)
                        .setHeader('content-type', 'application/json')
                        .send({ error: "Server error: " + err });
                }
            } else {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "Playercords updated" });
            }
        });
});

//Get plane color
app.get('/silversky/plane/get/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    db.get('SELECT * FROM planeColor WHERE planeid=?', [id], (err, row) => {
        if (!row) {
            res.status(404)
                .setHeader('content-type', 'application/json')
                .send({ error: "Plane was not found!" });
        } else {
            res.status(200)
                .setHeader('content-type', 'application/json')
                .send({ id: `${row.planeid}`, color: `${row.color}` });
        }
    });

});
//Edit plane color
app.put('/silversky/plane/update/:id', (req, res) => {
    const { id } = req.params; // get id from params
    const posted_cords = req.body; // submitted module

    db.run(`UPDATE planeColor SET color=? WHERE planeid=?`,
        [posted_cords.color, id], (err) => {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    res.status(422)
                        .setHeader('content-type', 'application/json')
                        .send({ error: "Something went wrong: " + err.message });
                } else { // other server-side error
                    res.status(500)
                        .setHeader('content-type', 'application/json')
                        .send({ error: "Server error: " + err });
                }
            } else {
                res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({ message: "Plane color updated" });
            }
        });
});



