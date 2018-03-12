import { getMockSocket } from 'utilities/test/mockingUtilities';

import { addHeroesToServer } from 'actionCreators/heroes/addHeroesToServer';

describe('addHeroesToServer', () => {
    const heroNames = ['tracer', 'phara', 'winston'];
    let socket;

    beforeEach(() => {
        socket = getMockSocket();
    });

    it('when heroNames are passed in should call socket.addHero for each hero passed in', () => {
        addHeroesToServer(heroNames, socket)();
        heroNames.forEach((heroName, i) => {
            expect(socket.addHero).toHaveBeenCalledWith(heroNames[i], (i+1));
        });
    });

    it('when no heroNames are passed in should not call socket.addHero', () => {
        addHeroesToServer([], socket)();
        expect(socket.addHero).not.toHaveBeenCalled();
    });
});