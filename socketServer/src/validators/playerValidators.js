const logger = require('winston');
const SocketError = require('./exceptions/SocketError');
const exceptions = require('./exceptions/exceptions');

let heroExists = function(playerHeros, hero) {
    let heroStats = playerHeros.find((element) => {
        return element.heroName === hero.heroName;
    });

    if (!heroStats) {
        logger.error(`Hero ${hero.battleNetId}:${hero.heroName} does not exist`);
        throw new SocketError(exceptions.heroNotFound, 'hero', hero);
    }
};

module.exports = {
    heroExists
};