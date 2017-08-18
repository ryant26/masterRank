
let mockEnvironments = ['develop', 'unitTest'];

let isMockEnvironment = function() {
    return mockEnvironments.indexOf(process.env.NODE_ENV) > -1;
};

let getMockedDependency = function(mockedName, realName) {
    if (isMockEnvironment()) {
        return require(mockedName);
    } else {
        return require(realName);
    }
};

let redis = getMockedDependency('redis-mock', 'redis');

module.exports = {
    mockEnvironments,
    isMockEnvironment,
    redis
};