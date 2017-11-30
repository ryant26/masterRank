const httpProxy = require('http-proxy');
const fs = require('fs');

module.exports = function() {
    httpProxy.createServer({
        ssl: {
            key: fs.readFileSync('../certs/key.pem'),
            cert: fs.readFileSync('../certs/cert.pem')
        },
        target: 'http://localhost:3003',
        secure: false // Depends on your needs, could be false.
    }).listen(3002);
};