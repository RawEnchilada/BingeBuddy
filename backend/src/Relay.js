const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const Configuration = require('./Configuration');
const SessionManager = require('./SessionManager').SessionManager;
const SessionStatus = require('./SessionManager').SessionStatus;

const config = Configuration.fromFile('config.json');
const sessionManager = new SessionManager();

const headers = {
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'POST, DELETE, GET',
    'Access-Control-Allow-Headers':'Session-Token,Access-Control-Allow-Origin,Content-Type'
};

const app = express();

app.use(bodyParser.json());

app.options('*', (req, res) => {
    res.set(headers).status(200).send("OK");
});

app.post('/session', (req, res) => {
    const passwordHash = req.body.passwordHash;

    const hashedPassword = crypto.createHash('sha256').update(config.password).digest('hex');

    if (passwordHash == hashedPassword) {
        const sessionToken = sessionManager.createSession();
        console.log(`Creating session: ${sessionToken}`);
        res.set(headers).status(200).json({'sessionToken': sessionToken});
    } else {
        console.log(`Incorrect password provided while trying to create session`);
        res.set(headers).status(403).send('Incorrect password');
    }
});

app.delete('/session', (req, res) => {
    const sessionToken = req.headers['session-token'];
    if (sessionToken == null) {
        console.log(`No session token provided while trying to revoke session`);
        res.set(headers).status(403).send('Session token not provided');
        return;
    }

    if (sessionManager.revokeSession(sessionToken)) {
        console.log(`Revoking session: ${sessionToken}`);
        res.set(headers).status(200).send('Session revoked');
    } else {
        console.log(`Invalid session token provided while trying to revoke session: ${sessionToken}`);
        res.set(headers).status(403).send('Invalid session token');
    }
});

app.get('/session', (req, res) => {
    const sessionToken = req.headers['session-token'];
    if (sessionToken == null) {
        console.log(`No session token provided while trying to check session`);
        res.set(headers).status(403).send('Session token not provided');
        return;
    }

    switch(sessionManager.checkToken(sessionToken)){

        case SessionStatus.active:
            console.log(`Checking session: ${sessionToken} = active`);
            res.set(headers).status(200).json({'status': 'active'});
            break;

        case SessionStatus.expired:
            console.log(`Checking session: ${sessionToken} = expired`);
            res.set(headers).status(403).json({'status': 'expired'});
            break;

        case SessionStatus.invalid:
            console.log(`Checking session: ${sessionToken} = invalid`);
            res.set(headers).status(403).json({'status': 'invalid'});
            break;
    }
});

app.get('*', async (req, res) => {
    const sessionToken = req.headers['session-token'];
    if (sessionToken == null) {
        console.log(`No session token provided while trying to relay request`);
        res.set(headers).status(403).send('Session token not provided');
        return;
    }
    switch(sessionManager.checkToken(sessionToken)){

        case SessionStatus.active:
            let redirectUrl = `${config.targetUrl}${req.originalUrl.replace(config.sourceUrl, '')}`;
            if(redirectUrl.includes('?')){
                redirectUrl += `&api_key=${config.apiKey}`;
            } else {
                redirectUrl += `?api_key=${config.apiKey}`;
            }
            console.log(`Redirecting to ${redirectUrl}`);

            fetch(redirectUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (response) => {
                if (response.ok) {
                    res.set(headers).status(200).json(await response.json());
                } else {
                    return res.set(headers).status(response.status).send(response.statusText);
                }
            }).catch(error => {
                return res.set(headers).status(500).send(error.toString());
            });
            break;

        case SessionStatus.expired:
            console.log(`Session token expired: ${sessionToken}, refusing to relay request`);
            res.set(headers).status(403).send('Session token expired');
            break;

        case SessionStatus.invalid:
            console.log(`Invalid session token provided while trying to relay request: ${sessionToken}, refusing to relay request`);
            res.set(headers).status(403).send('Invalid session token');
            break;
    }
});

const server = app.listen(config.port, () => {
    console.log(`Relay listening on port ${server.address().port}`);
});