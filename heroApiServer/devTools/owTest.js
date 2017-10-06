let ow = require('oversmash').default();

ow.playerStats('fsdkljfslkdjfs#2211', 'us', 'pc').then((result) => {
    return result.stats;
}).catch((err) => {
    console.log(err);
});