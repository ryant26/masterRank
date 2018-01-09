const allHeroNames = require('../../../shared/allHeroNames').names;

const validateHeroName = function(heroName) {
    return allHeroNames.includes(heroName);
};

module.exports = {
    validateHeroName
};