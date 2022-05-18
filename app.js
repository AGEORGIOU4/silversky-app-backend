const express = require('express');

const events = require('./calls/events')

const db = require('./db/configDB');

const app = express();
const PORT = process.env.PORT || 5000;

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



