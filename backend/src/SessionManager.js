const crypto = require('crypto');


const SessionStatus = {
    active: 0,
    expired: 1,
    invalid: 2
};


class SessionToken {
    constructor(token, expiration) {
        this.token = token;
        this.expiration = expiration;
    }
}

class SessionManager {
    constructor() {
        this.authorizedSessions = [];
    }

    checkToken(token) {
        const session = this.authorizedSessions.find(element => element.token === token);
        if (!session) {
            return SessionStatus.invalid;
        } else if (session.expiration < new Date()) {
            this.authorizedSessions = this.authorizedSessions.filter(element => element.token !== token);
            return SessionStatus.expired;
        } else {
            return SessionStatus.active;
        }
    }

    createSession() {
        const sessionToken = crypto.randomBytes(32).toString('base64');
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + 1);
        const session = new SessionToken(sessionToken, expiration);
        this.authorizedSessions.push(session);
        return sessionToken;
    }

    revokeSession(token) {
        const index = this.authorizedSessions.findIndex(element => element.token === token);
        if (index === -1) {
            return false;
        } else {
            this.authorizedSessions.splice(index, 1);
            return true;
        }
    }
}


module.exports = {
    SessionManager,
    SessionStatus
};