let ow = require('oversmash').default();

ow.playerStats('luckybomb-1470', 'us', 'pc').then((result) => {
    return result.stats;
}).catch((err) => {
    console.log(err);
});