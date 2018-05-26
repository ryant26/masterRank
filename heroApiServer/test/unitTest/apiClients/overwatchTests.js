const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const overstatStubs = {
    player: sinon.stub().resolves({accounts: []}),
    playerStats: sinon.stub().resolves({}),
};

const overstat = function() {return overstatStubs;};

const ow = proxyquire('../../../src/apiClients/overwatch', {'overstat': overstat});

const getToken = function({platformDisplayName='test#1234', platform='pc', region='us'} = {}) {
    return {
        platformDisplayName,
        platform,
        region
    };
};

describe('Overwatch API', function() {

    let sandbox;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('getPlayerDetails', function() {
        it('should call the API with the correct platform display name', function() {
            const platformDisplayName = 'myDisplayName';

            assert.isFalse(overstatStubs.player.called);
            return ow.getPlayerDetails(getToken({platformDisplayName})).then(() => {
                assert.isTrue(overstatStubs.player.calledWith(platformDisplayName));
            });
        });

        it('should handle special characters', function() {
            const platformDisplayName = 'パイオツ#1203';
            const uriEncoded = '%E3%83%91%E3%82%A4%E3%82%AA%E3%83%84%231203';
            return ow.getPlayerDetails(getToken({platformDisplayName})).then(() => {
                assert.isTrue(overstatStubs.player.calledWith(uriEncoded));
            });
        });

        it('should return undefined if it doesn\'t find a platformDisplayName and platform match', function() {
            const platformDisplayName = 'helloName';
            const platform = 'pc';
            const badPlatform = {
                displayName: platformDisplayName,
                platform: 'noGood'
            };

            const badName = {
                displayName: 'noGood',
                platform
            };

            overstatStubs.player = sandbox.stub().resolves({accounts: [badName, badPlatform]});

            return ow.getPlayerDetails(getToken({platformDisplayName})).then((result) => {
                assert.isUndefined(result);
            });
        });

        it('should return the result that matches platformDisplayName and platform', function() {
            const platformDisplayName = 'helloName';
            const platform = 'pc';

            const account = {
                displayName: platformDisplayName,
                platform
            };

            overstatStubs.player = sandbox.stub().resolves({accounts: [account]});

            return ow.getPlayerDetails(getToken({platformDisplayName, platform})).then((result) => {
                assert.deepEqual(result, account);
            });
        });

    });

    describe('getPlayerStats', function() {
        beforeEach(function() {
            overstatStubs.playerStats = sandbox.stub().resolves({});
        });

        it('should replace # with - in platformDisplayName', function() {
            const platformDisplayName = 'Test#1234';

            assert.isFalse(overstatStubs.playerStats.called);
            return ow.getPlayerStats(getToken({platformDisplayName})).then(() => {
                assert.isTrue(overstatStubs.playerStats.calledWith('Test-1234'));
            });
        });

        it('should replace url encode the platformDisplayName', function() {
            const platformDisplayName = 'パイオツ#1203';
            const uriEncoded = '%E3%83%91%E3%82%A4%E3%82%AA%E3%83%84-1203';

            return ow.getPlayerStats(getToken({platformDisplayName})).then(() => {
                assert.isTrue(overstatStubs.playerStats.calledWith(uriEncoded));
            });
        });
    });

    describe('searchForPlayer', function() {
        beforeEach(function() {
            overstatStubs.player = sandbox.stub().resolves({accounts: []});
        });

        it('should call the API with the correct platform display name', function() {
            const platformDisplayName = 'myDisplayName';

            assert.isFalse(overstatStubs.player.called);
            return ow.searchForPlayer(getToken({platformDisplayName})).then(() => {
                assert.isTrue(overstatStubs.player.calledWith(platformDisplayName));
            });
        });

        it('should handle special characters', function() {
            const platformDisplayName = 'パイオツ#1203';
            const uriEncoded = '%E3%83%91%E3%82%A4%E3%82%AA%E3%83%84%231203';
            return ow.searchForPlayer(getToken({platformDisplayName})).then(() => {
                assert.isTrue(overstatStubs.player.calledWith(uriEncoded));
            });
        });

        it('should replace displayName with platformDisplayName', function() {
            const platformDisplayName = 'myDisplayName';
            const platform = 'pc';

            overstatStubs.player = sandbox.stub().resolves({accounts: [
                {displayName: platformDisplayName, platform}
            ]});

            return ow.searchForPlayer(getToken({platformDisplayName})).then((result) => {
                assert.lengthOf(result, 1);
                assert.equal(result[0].platformDisplayName, platformDisplayName);
            });
        });

        it('should filter by platform', function() {
            const platformDisplayName = 'myDisplayName';
            const platform = 'pc';

            overstatStubs.player = sandbox.stub().resolves({accounts: [
                {displayName: platformDisplayName, platform}, {displayName: platformDisplayName, platform: 'xbl'}
            ]});

            return ow.searchForPlayer(getToken({platformDisplayName})).then((result) => {
                assert.lengthOf(result, 1);
                assert.equal(result[0].platformDisplayName, platformDisplayName);
                assert.equal(result[0].platform, platform);
            });
        });

        it('should return all results with a common platform', function() {
            const platformDisplayName = 'myDisplayName';
            const platform = 'pc';

            overstatStubs.player = sandbox.stub().resolves({accounts: [
                {displayName: platformDisplayName, platform}, {displayName: 'secondDisplayName', platform}
            ]});

            return ow.searchForPlayer(getToken({platformDisplayName})).then((result) => {
                assert.lengthOf(result, 2);
            });
        });
    });
});