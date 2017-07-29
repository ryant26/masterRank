const logger = require('winston');

let heroExists = function(playerHeros, hero) {
    let heroStats = playerHeros.find((element) => {
        return element.heroName === hero.heroName;
    });

    if (!heroStats) {
        logger.error(`Hero ${hero.battleNetId}:${hero.heroName} does not exist`);
        throw 'Hero not found';
    }
};

module.exports = {
    heroExists
};