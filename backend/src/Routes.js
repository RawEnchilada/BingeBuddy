const crypto = require('crypto');
const SessionStatus = require('./SessionManager').SessionStatus;
const List = require('./Lists').List;
const myList = require('./Lists').myList;


module.exports = (app,config,sessionManager)=>{


const headers = {
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'POST, DELETE, GET',
    'Access-Control-Allow-Headers':'Session-Token,Access-Control-Allow-Origin,Content-Type'
};



app.options('*', (req, res) => {
    res.set(headers).status(200).json({'result':'OK'});
});



//Session management routes.
app.get('/session', (req, res) => {
    const sessionToken = req.headers['session-token'];
    if (sessionToken == null) {
        console.log(`No session token provided while trying to check session`);
        res.set(headers).status(403).json({'error':'Session token not provided'});
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

app.post('/session', (req, res) => {
    const passwordHash = req.body.passwordHash;

    const hashedPassword = crypto.createHash('sha256').update(config.password).digest('hex');

    if (passwordHash == hashedPassword) {
        const sessionToken = sessionManager.createSession();
        console.log(`Creating session: ${sessionToken}`);
        res.set(headers).status(200).json({'sessionToken': sessionToken});       
    } else {
        console.log(`Incorrect password provided while trying to create session`);
        res.set(headers).status(403).json({'error':'Incorrect password'});
    }
});

app.delete('/session', (req, res) => {
    const sessionToken = req.headers['session-token'];
    if (sessionToken == null) {
        console.log(`No session token provided while trying to revoke session`);
        res.set(headers).status(403).json({'error':'Session token not provided'});
        return;
    }

    if (sessionManager.revokeSession(sessionToken)) {
        console.log(`Revoking session: ${sessionToken}`);
        res.set(headers).status(200).json({'result':'Session revoked'});
    } else {
        console.log(`Invalid session token provided while trying to revoke session: ${sessionToken}`);
        res.set(headers).status(403).json({'error':'Invalid session token'});
    }
});

//Session verification
app.all('*', (req, res, next) => {
    const sessionToken = req.headers['session-token'];
    if (sessionToken == null) {
        console.log(`No session token provided while trying to relay request`);
        res.set(headers).status(403).json({'error':'Session token not provided'});
        return;
    }
    switch(sessionManager.checkToken(sessionToken)){
        case SessionStatus.active:
            //Pass request to next handler when session is active.
            next();
            break;
        
        case SessionStatus.expired:
            console.log(`Session token expired: ${sessionToken}, refusing to relay request`);
            res.set(headers).status(403).json({'error':'Session token expired'});
            break;

        case SessionStatus.invalid:
            console.log(`Invalid session token provided while trying to relay request: ${sessionToken}, refusing to relay request`);
            res.set(headers).status(403).json({'error':'Invalid session token'});
            break;
    }
});

//List management routes.
app.get('/:mediaType/:listType', async (req, res, next) => {
    if (req.params.mediaType in myList && req.params.listType in myList[req.params.mediaType]) {
        const items = myList[req.params.mediaType][req.params.listType].items;
        console.log(`Getting list: ${req.params.mediaType}/${req.params.listType} = ${items.length} items`);
        res.set(headers).status(200).json(items);
    }else{
        next();
    }
});

app.post('/:mediaType/:listType', async (req, res, next) => {
    if (req.params.mediaType in myList && req.params.listType in myList[req.params.mediaType]) {
        if(req.body.id == null){
            console.log(`No id provided while trying to add item to list: ${req.params.mediaType}/${req.params.listType}`);
            res.set(headers).status(400).json({'error':'No id provided'});
            return;
        }
        myList[req.params.mediaType][req.params.listType].add(req.body);
        console.log(`Adding item to list: ${req.params.mediaType}/${req.params.listType} = ${req.body.id}`);
        res.set(headers).status(200).json({'result':'OK'});
    }else{
        next();
    }
});

app.delete('/:mediaType/:listType', async (req, res, next) => {
    if (req.params.mediaType in myList && req.params.listType in myList[req.params.mediaType]) {
        if(req.body.id == null){
            console.log(`No id provided while trying to remove item from list: ${req.params.mediaType}/${req.params.listType}`);
            res.set(headers).status(400).json({'error':'No id provided'});
            return;
        }
        myList[req.params.mediaType][req.params.listType].remove(req.body.id);
        console.log(`Removing item from list: ${req.params.mediaType}/${req.params.listType} = ${req.body.id}`);
        res.set(headers).status(200).json({'result':'OK'});
    }else{
        next();
    }
});

//Relay all other requests to the target URL.
app.get('*', async (req, res) => {
    let redirectUrl = `${config.targetUrl}${req.originalUrl.replace(config.sourceUrl, '')}`;
    if(redirectUrl.includes('?')){
        redirectUrl += `&api_key=${config.apiKey}`;
    } else {
        redirectUrl += `?api_key=${config.apiKey}`;
    }
    console.log(`Relaying request from ${req.headers['session-token']} of ${redirectUrl}`);

    fetch(redirectUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async (response) => {
        if (response.ok) {
            let data = await response.json();
            res.set(headers).status(200).json(data);
        } else {
            return res.set(headers).status(response.status).json({'result':response.statusText});
        }
    }).catch(error => {
        return res.set(headers).status(500).json({'error':error.toString()});
    });
    
});
}
