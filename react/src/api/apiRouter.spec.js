import { getSocketApiBase } from 'api/apiRouter';

const mockHostname = (hostname) => {
    Object.defineProperty(window.location, 'hostname', {
        writable: true,
        value: hostname
    });
};

const unmockHostname = () => {
    Object.defineProperty(window.location, 'hostname', {
        writable: true,
        value: undefined
    });
};

describe('Api Router', () => {
    let token;

    beforeEach(() => {
        token = {
            platformDisplayName: 'Test#1234',
            region: 'us',
            platform: 'pc'
        };
    });

    afterEach(() => {
        unmockHostname();
    });

    describe('getSocketApiBase', () => {
        it('should append the port for localhost deployments', () => {
            mockHostname('localhost');
            expect(getSocketApiBase(token)).toEqual(`localhost:3004/${token.region}/${token.platform}`);
        });

        it('should prepend socket. for non-localhost deployments', () => {
            mockHostname('test.fireteam.gg');
            expect(getSocketApiBase(token)).toEqual(`socket.test.fireteam.gg/${token.region}/${token.platform}`);
        });
    });
});
