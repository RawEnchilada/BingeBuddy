# BingeBuddy


## <b>Backend</b>

### <b>Configuration</b>

The backend is configured using a config.json file, with the following parameters:

```json
{
    "apiKey":"tmdb_v3_api_key_here",
    "password":"your_password_here",
    "targetUrl":"https://api.themoviedb.org/3",
    "port": 8080,
    "certificatePath": "some/where/certificate.pem",
    "keyPath": "some/where/key.pem"
}
```


### <b>Creating a new session token</b>

To create a new session token, send a POST request to the `/newSession` route with a JSON body containing a passwordHash field:

```bash

curl -X POST -H "Content-Type: application/json" \
-d '{"passwordHash":"your_password_hash_here"}' \
http://your_server_url_here/newSession
```

The server will respond with a JSON object containing a sessionToken field:

```json
{
    "sessionToken": "generated_session_token_here"
}
```

Save the sessionToken value, as you will need to include it in future requests.

### <b>Redirecting to a new URL</b>

To redirect to a new URL, send a GET request to the `/` route with a session-token header set to the value of the previously generated session token:

```bash

curl -H "session-token: generated_session_token_here" \
http://your_server_url_here/
```

The server will respond with a 303 See Other response, with a Location header set to the new URL:

```bash

HTTP/1.1 303 See Other
Location: https://your_target_url_here.com/path/to/requested/resource
```

Follow the Location header to the new URL. If the session-token header value is not valid, you will receive a 403 Forbidden response.