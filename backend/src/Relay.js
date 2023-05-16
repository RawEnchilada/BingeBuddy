const express = require('express');
const bodyParser = require('body-parser');
const Configuration = require('./Configuration');
const SessionManager = require('./SessionManager').SessionManager;

const config = Configuration.fromFile('config.json');
const sessionManager = new SessionManager();


const app = express();

app.use(bodyParser.json());


require('./Routes')(app, config, sessionManager);

// create request token
fetch(`${config.targetUrl}/authentication/token/new?api_key=${config.apiKey}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(async (response) => {
    if (response.ok) {
        let data = await response.json();
        config.requestToken = data.request_token;
        console.log(`Request token created: ${config.requestToken}`);
    } else {
        console.log(`Failed to create request token: ${response.statusText}`);
    }
}).catch(error => {
    console.log(`Failed to create request token: ${error.toString()}`);
});
        

const server = app.listen(config.port, () => {
    console.log(`Relay listening on port ${server.address().port}`);
});