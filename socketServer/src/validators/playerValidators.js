const logger = require('../services/logger').sysLogger;
const exceptions = require('./exceptions/exceptions');
const stringValidator = require('./stringValidators').runAllValidators;

let heroExists = function(playerHeros, hero) {
    let heroStats = playerHeros.find((element) => {
        return element.heroName === hero.heroName;
    });

    if (!heroStats) {
        logger.error(`Hero ${hero.platformDisplayName}:${hero.heroName} does not exist`);
        throw exceptions.heroNotFound;
    }
};

let validHeroObject = function (hero) {
    if (hero.platformDisplayName
        && hero.heroName
        && typeof hero.platformDisplayName === 'string'
        && hero.platformDisplayName.length > 0) {
        return validateHeroName(hero.heroName);
    }
    logger.error(`Received malformed hero object [${hero}]`);
    throw exceptions.malformedHeroObject;
};

let validateHeroName = function (heroName) {
    if (stringValidator(heroName)) {
        return true;
    }
    logger.error(`Received invalid hero name [${heroName}]`);
    throw exceptions.invalidHeroName;
};

let validatePriority = function (priority) {
    if (typeof priority === 'number'
    && priority > 0
    && priority < 6) {
        return true;
    }

    logger.error(`Reveived invalid priority [${priority}]`);
    throw exceptions.invalidPriority;
};

module.exports = {
    heroExists,
    validHeroObject,
    validateHeroName,
    validatePriority
};