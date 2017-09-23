const mongoose = require('mongoose');
const config = require('config');

const dbPath = config.get('db');

let connect = function() {
    mongoose.promise = Promise;
    mongoose.connect(dbPath);
    let db = mongoose.connection;

    db.on('error', function () {
        throw new Error('unable to connect to database at ' + dbPath);
    });
};

module.exports = {
    connect
};