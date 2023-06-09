const fs = require('fs');

/**
 * Represents the configuration of the application.
 */
class Configuration {
    constructor(apiKey, password, sourceUrl, targetUrl, port, certificatePath, keyPath) {
        this.apiKey = apiKey;
        this.password = password;
        this.sourceUrl = sourceUrl;
        if(targetUrl.pathname.endsWith('/')) {
            targetUrl.pathname = targetUrl.pathname.substring(0, targetUrl.pathname.length - 1);
        }
        this.targetUrl = targetUrl;
        this.port = port;
        // TODO: Validate certificate and key paths to allow use of HTTPS.
        this.certificatePath = certificatePath;
        this.keyPath = keyPath;
        this.authorized = false;
    }

    /**
     * Loads a configuration from a JSON file.
     * @param path The path to the JSON file.
     */
    static fromFile(path) {
        try {
            const jsonString = fs.readFileSync(path, 'utf8');
            const jsonMap = JSON.parse(jsonString);
            return new Configuration(
                jsonMap.apiKey,
                jsonMap.password,
                new URL(jsonMap.sourceUrl),
                new URL(jsonMap.targetUrl),
                jsonMap.port,
                jsonMap.certificatePath,
                jsonMap.keyPath
            );
        } catch (e) {
            throw new Error(`Failed to load configuration file: ${e}`);
        }
    }
}

module.exports = Configuration;

