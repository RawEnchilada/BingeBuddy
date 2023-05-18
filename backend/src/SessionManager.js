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
/**
 * Manages sessions.
 */
class SessionManager {
    constructor() {
        this.authorizedSessions = [];
    }

    /**
     * Checks a session token's status.
     * @param {String} token : The session token to check.
     * @returns {SessionStatus} The status of the session.
     */
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

    /**
     * Creates a new session.
     * @returns {String} The session token.
     */
    createSession() {
        const sessionToken = crypto.randomBytes(32).toString('base64');
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + 1);
        const session = new SessionToken(sessionToken, expiration);
        this.authorizedSessions.push(session);
        return sessionToken;
    }

    /**
     * Revokes a session.
     * @param {String} token : The session token to revoke.
     * @returns {Boolean} True if the session was revoked, false if the session was not found.
     */
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