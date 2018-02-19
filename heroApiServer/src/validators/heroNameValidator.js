const allHeroNames = require('../../../shared/libs/allHeroNames').names;

const validateHeroName = function(heroName) {
    return allHeroNames.includes(heroName);
};

module.exports = {
    validateHeroName
};