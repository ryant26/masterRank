// File is named zz cleanup so that it runs last
const assert = require('chai').assert;
const bluebird = require('bluebird');
const config = require('config');
const logger = require('winston');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);

describe('Cleanup Tests', function() {
    let client;

    before(function() {
        let redisUrl = `redis://${config.get('redis.host')}:${config.get('redis.port')}`;
        logger.info(`Opening new connection to redis [${redisUrl}]`);

        client = redis.createClient({
            url: redisUrl
        });
    });

    it('Should leave no keys in the redis DB after all tests run', function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(client.keysAsync('*').then((keys) => {
                    // the "groups" key will always be there, this is fine
                    assert.lengthOf(keys, 1, 'There are keys in the redis DB after the tests run');
                }));
            }, 1000);
        });
    });
});
