# Hero API Server
This microservice the REST portion of the API. It will be used to:

- Search for player IDs (bnet/psn/xbl)
- Retrieve hero stats for players

## Local Setup

Install the dependencies
```
npm install
```

Intall MongoDB
Lookup instructions for your OS, Mac:
```
brew install mongodb
```

Add the certificate to your keychain (../certs/cert.pem)


Run the build (lint & test)
```
gulp
```

Start the server (Development mode)
```
gulp serve
```

Access the application from postman or your browser
```
https://localhost:3000
```

## Configuration
Configuration files is managed by [config.js](https://www.npmjs.com/package/config).

Specify the config file to use by setting the NODE_ENV environment variable. eg.
```
NODE_ENV=production nodemon src/app.js
```

This would start the server and use the `production.json` config file in the `config/` directory.