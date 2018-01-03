import Websocket from './websocket';
import token from '../resources/token';

describe('Websocket API', () => {
    let websocket;

    beforeEach(() => {
        websocket = new Websocket(token);
    });

    afterEach(() => {
        websocket.disconnect();
    });

    describe('addHero', () => {
        it('should emit the addHero event', (done) => {
            let heroName = 'soldier76';
            let preference = 1;
            websocket.socket.emit = function(event, heroData) {
                expect(event).toEqual('addHero');
                expect(heroData).toEqual({heroName, priority: preference});
                done();
            };
            websocket.addHero(heroName, preference);
        });
    });
});
