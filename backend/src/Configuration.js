const fs = require('fs');

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
        this.certificatePath = certificatePath;
        this.keyPath = keyPath;
    }

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

