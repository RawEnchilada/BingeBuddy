const express = require('express');
const bodyParser = require('body-parser');
const Configuration = require('./Configuration');
const SessionManager = require('./SessionManager').SessionManager;

const config = Configuration.fromFile('config.json');
const sessionManager = new SessionManager();


const app = express();

app.use(bodyParser.json());


require('./Routes')(app, config, sessionManager);

const server = app.listen(config.port, () => {
    console.log(`Relay listening on port ${server.address().port}`);
});