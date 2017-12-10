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
            let hero = {heroName: 'soldier76'};
            websocket.socket.emit = function(event, heroData) {
                expect(event).toEqual('addHero');
                expect(heroData).toEqual(hero);
                done();
            };
            websocket.addHero(hero);
        });
    });
});
