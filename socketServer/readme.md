# Socket Server
This microservice manages the realtime portion of the API. It will be used to:

- List the hero's looking for a group
- Send, receive, accept, and decline group invites

## Local Setup

Install the dependencies
```
npm install
```

Run the build (lint & test)
```
gulp
```

Start the server (Development mode)
```
gulp serve
```

## Configuration
Configuration files is managed by [config.js](https://www.npmjs.com/package/config).

Specify the config file to use by setting the NODE_ENV environment variable. eg.
```
NODE_ENV=production nodemon src/app.js
```

This would start the server and use the `production.json` config file in the `config/` directory.