const environment = process.env.NODE_ENV;
const playerService = require('../services/playerService');
const ranks = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster'];
const logger = require('../services/logger').sysLogger;
const players = [
    {
        platformDisplayName: 'SoOn#2543',
        heroes: ['tracer', 'widowmaker', 'mccree']
    },
    {
        platformDisplayName: 'EFFECT#31630',
        heroes: ['widowmaker', 'tracer', 'mccree']
    },
    {
        platformDisplayName: 'Yoli#2477',
        heroes: ['mercy', 'dva', 'orisa']
    }
];

const mockNameSpace = {
    to: () => {return {emit: () => {}};}
};

const shouldAddMockData = () => {
    return process.argv.includes('--mock-data');
};

const printSuccessMessage = (msg) => {
    logger.info('=======================================');
    logger.info('=======================================');
    logger.info('=======================================');
    logger.info(`${msg}`);
    logger.info('=======================================');
    logger.info('=======================================');
    logger.info('=======================================');
};

const printFailureMessage = (msg) => {
    logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    logger.error(`${msg}`);
    logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    logger.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
};

const mockHeroData = () => {
    let allHeroesAdded = [];
    players.forEach((player) => {
        player.heroes.forEach((hero) => {
            ranks.forEach((rank) => {
                allHeroesAdded.push(playerService.addHeroByName({platformDisplayName: player.platformDisplayName, region: 'us', platform: 'pc'},
                    rank,
                    mockNameSpace,
                    {heroName: hero}));
            });
        });
    });
    return Promise.all(allHeroesAdded)
        .then(() => printSuccessMessage('All mock heroes have been added.'))
        .catch((err) => printFailureMessage(`Error adding mock heroes: ${err}`));
};

const mockDataForEnvironment = () => {
    if (environment === 'develop' && shouldAddMockData()) {
        mockHeroData();
    }
};

module.exports = {
    mockDataForEnvironment
};