const logger = require('../services/logger').sysLogger;
const SocketError = require('./exceptions/SocketError');
const exceptions = require('./exceptions/exceptions');
const stringValidator = require('./stringValidators').runAllValidators;

let heroExists = function(playerHeros, hero) {
    let heroStats = playerHeros.find((element) => {
        return element.heroName === hero.heroName;
    });

    if (!heroStats) {
        logger.error(`Hero ${hero.battleNetId}:${hero.heroName} does not exist`);
        throw new SocketError(exceptions.heroNotFound, 'hero', hero);
    }
};

let validHeroObject = function (hero) {
    if (hero.battleNetId
        && hero.heroName
        && typeof hero.battleNetId === 'string'
        && hero.battleNetId.length > 0) {
        return validateHeroName(hero.heroName);
    }
    logger.error(`Received malformed hero object [${hero}]`);
    throw new SocketError(exceptions.malformedHeroObject, 'hero', hero);
};

let validateHeroName = function (heroName) {
    if (stringValidator(heroName)) {
        return true;
    }
    logger.error(`Received invalid hero name [${heroName}]`);
    throw new SocketError(exceptions.invalidHeroName, 'heroName', heroName);
};

let validatePriority = function (priority) {
    if (typeof priority === 'number'
    && priority > 0
    && priority < 6) {
        return true;
    }

    logger.error(`Reveived invalid priority [${priority}]`);
    throw new SocketError(exceptions.invalidPriority, 'priority', priority);
};

module.exports = {
    heroExists,
    validHeroObject,
    validateHeroName,
    validatePriority
};