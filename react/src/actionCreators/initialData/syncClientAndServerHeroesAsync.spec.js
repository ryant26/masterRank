import * as mockUtils from 'utilities/test/mockingUtilities';

import {
    addHero as addHeroAction,
    clearAllHeroes as clearAllHeroesAction
} from 'actionCreators/heroes/hero';
jest.mock('actionCreators/heroes/hero');
import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction,
} from "actionCreators/loading";
jest.mock('actionCreators/loading');
import { preferMostPlayedHeroesAsync } from 'actionCreators/preferredHeroes/preferMostPlayedHeroesAsync';
jest.mock('actionCreators/preferredHeroes/preferMostPlayedHeroesAsync');
import { addHeroesToServerAsync } from 'actionCreators/heroes/addHeroesToServerAsync';
jest.mock('actionCreators/heroes/addHeroesToServerAsync');
import { updateHeroes as updatePreferredHeroes } from "actionCreators/preferredHeroes/preferredHeroes";
jest.mock('actionCreators/preferredHeroes/preferredHeroes');
import { stopLoginTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';
jest.mock('actionCreators/googleAnalytic/googleAnalytic');

import NotRealHeroes from 'resources/metaListFillerHeroes';

import { syncClientAndServerHeroesAsync } from 'actionCreators/initialData/syncClientAndServerHeroesAsync';

const clearAllMockedImports = () => {
    addHeroAction.mockClear();
    clearAllHeroesAction.mockClear();
    pushBlockingLoadingAction.mockClear();
    popBlockingLoadingAction.mockClear();
    preferMostPlayedHeroesAsync.mockClear();
    addHeroesToServerAsync.mockClear();
    updatePreferredHeroes.mockClear();
    stopLoginTrackingEvent.mockClear();
};

describe('syncClientAndServerHeroesAsync', () => {
    const user = mockUtils.generateMockUser();
    const usersHeroes = [
        mockUtils.generateMockHero('tracer', user.platformDisplayName),
        mockUtils.generateMockHero('winston',  user.platformDisplayName),
        mockUtils.generateMockHero('phara',  user.platformDisplayName)
    ];
    const notUsersHeroes = [
        mockUtils.generateMockHero('widowmaker', `not${user.platformDisplayName}`),
        mockUtils.generateMockHero('mercy', `not${user.platformDisplayName}`),
    ];
    const heroesFromServer = [
        ...usersHeroes,
        ...notUsersHeroes
    ];
    let dispatch;
    let getState;
    let socket;

    beforeEach(() => {
        dispatch = jest.fn();
        socket = mockUtils.getMockSocket();
        mockUtils.mockLocalStorage();
    });

    afterEach(() => {
        clearAllMockedImports();
    });

    describe('should always', () => {
        beforeEach(() => {
            getState = mockUtils.mockGetState({
                user,
                preferredHeroes: {
                    heroes: []
                }
            });
            syncClientAndServerHeroesAsync(heroesFromServer, socket)(dispatch, getState);
        });

        it('call clearAllHeroesAction', () => {
            expect(clearAllHeroesAction).toHaveBeenCalled();
        });

        it('call addHeroAction for each meta list filler hero', () => {
            NotRealHeroes.forEach((hero) => {
                expect(addHeroAction).toHaveBeenCalledWith(hero);
            });
        });

        it('add all heroesFromServer to meta lists', () => {
            heroesFromServer.forEach((hero) => {
                expect(addHeroAction).toHaveBeenCalledWith(hero);
            });
        });

        it('call popBlockingLoadingAction, to clear the pushed loading screen set in model.initialize', () => {
            expect(popBlockingLoadingAction).toHaveBeenCalled();
        });

        it('dispatch stopLoginTrackingEvent', () => {
            expect(stopLoginTrackingEvent).toHaveBeenCalledWith(user.platformDisplayName);
        });
    });

    describe('when user has no locally preferred heroes and no preferred heroes on the server', () => {

        beforeEach(() => {
            getState = mockUtils.mockGetState({
                user,
                preferredHeroes: {
                    heroes: []
                }
            });
            syncClientAndServerHeroesAsync([...notUsersHeroes], socket)(dispatch, getState);
        });

        it('should call preferMostPlayedHeroesAsync', () => {
            expect(getState().preferredHeroes.heroes).toEqual([]);
            expect(preferMostPlayedHeroesAsync).toHaveBeenCalledWith(user, localStorage.getItem('accessToken'), socket);
        });

        it('should not call updatePreferredHeroes', () => {
            expect(updatePreferredHeroes).not.toHaveBeenCalled();
        });

        it('should not call addHeroesToServerAsync', () => {
            expect(addHeroesToServerAsync).not.toHaveBeenCalled();
        });
    });

    describe('when user has no locally preferred heroes and some preferred heroes on the server', () => {
        let heroNamesFromServer;

        beforeEach(() => {
            getState = mockUtils.mockGetState({
                user,
                preferredHeroes: {
                    heroes: []
                }
            });
            
            heroNamesFromServer = usersHeroes.map((hero) => hero.heroName);
            
            syncClientAndServerHeroesAsync(heroesFromServer, socket)(dispatch, getState);
        });

        it('should call updatePreferredHeroes with the server heroes', () => {
            expect(getState().preferredHeroes.heroes).toEqual([]);
            expect(updatePreferredHeroes).toHaveBeenCalledWith(heroNamesFromServer);
        });

        it('should not call preferMostPlayedHeroesAsync', () => {
            expect(preferMostPlayedHeroesAsync).not.toHaveBeenCalled();
        });

        it('should not call addHeroesToServerAsync', () => {
            expect(addHeroesToServerAsync).not.toHaveBeenCalled();
        });
    });

    describe('when user has some locally preferred heroes and no preferred heroes on the server', () => {
        const preferredHeroes = ['reinhard', 'sombra'];

        beforeEach(() => {
            getState = mockUtils.mockGetState({
                user,
                preferredHeroes: {
                    heroes: preferredHeroes
                }
            });
            syncClientAndServerHeroesAsync([...notUsersHeroes], socket)(dispatch, getState);
        });

        it('should call addHeroesToServerAsync with preferred hero and socket', () => {
            expect(getState().preferredHeroes.heroes).toEqual(preferredHeroes);
            expect(addHeroesToServerAsync).toHaveBeenCalledWith(preferredHeroes, socket);
        });

        it('should not call preferMostPlayedHeroesAsync', () => {
            expect(preferMostPlayedHeroesAsync).not.toHaveBeenCalled();
        });

        it('should not call updatePreferredHeroes', () => {
            expect(updatePreferredHeroes).not.toHaveBeenCalled();
        });
    });

    describe('when user has some locally preferred heroes and some preferred heroes on the server', () => {
        const preferredHeroes = ['reinhard', 'sombra'];
        let heroNamesFromServer;

        beforeEach(() => {
            getState = mockUtils.mockGetState({
                user,
                preferredHeroes: {
                    heroes: preferredHeroes
                }
            });

            heroNamesFromServer = usersHeroes.map((hero) => hero.heroName);

            syncClientAndServerHeroesAsync(heroesFromServer, socket)(dispatch, getState);
        });

        it('should call updatePreferredHeroes with the server heroes', () => {
            expect(getState().preferredHeroes.heroes).toEqual(preferredHeroes);
            expect(updatePreferredHeroes).toHaveBeenCalledWith(heroNamesFromServer);
        });

        it('should not call preferMostPlayedHeroesAsync', () => {
            expect(preferMostPlayedHeroesAsync).not.toHaveBeenCalled();
        });

        it('should not call addHeroesToServerAsync', () => {
            expect(addHeroesToServerAsync).not.toHaveBeenCalled();
        });
    });
});