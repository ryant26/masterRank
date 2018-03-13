import * as mockUtils from '../../utilities/test/mockingUtilities';

import {
    addHero as addHeroAction,
    clearAllHeroes as clearAllHeroesAction
} from "../heroes/hero";
jest.mock('../heroes/hero');
import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction,
} from "../loading";
jest.mock('../loading');
import { preferMostPlayedHeroesAsync } from '../preferredHeroes/preferMostPlayedHeroesAsync';
jest.mock('../preferredHeroes/preferMostPlayedHeroesAsync');
import { addHeroesToServerAsync } from '../heroes/addHeroesToServerAsync';
jest.mock('../heroes/addHeroesToServerAsync');
import { runWalkthrough } from '../walkthrough/walkthrough';
jest.mock('../walkthrough/walkthrough');

import NotRealHeroes from '../../resources/metaListFillerHeroes';

import { syncClientAndServerHeroesAsync } from './syncClientAndServerHeroesAsync';

const clearAllMockedImports = () => {
    addHeroAction.mockClear();
    clearAllHeroesAction.mockClear();
    pushBlockingLoadingAction.mockClear();
    popBlockingLoadingAction.mockClear();
    preferMostPlayedHeroesAsync.mockClear();
    addHeroesToServerAsync.mockClear();
    runWalkthrough.mockClear();
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
            getState = mockUtils.mockGetState();
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

        it('add all heroes from server to the store that do not belong to the user', () => {
            heroesFromServer.forEach((hero) => {
                if(hero.platformDisplayName !== getState().user.platformDisplayName){
                    expect(addHeroAction).toHaveBeenCalledWith(hero);
                } else {
                    expect(addHeroAction).not.toHaveBeenCalledWith(hero);
                }
            });
        });

        it('remove all heroes from server that belong to the user', () => {
            heroesFromServer.forEach((hero) => {
                if(hero.platformDisplayName === getState().user.platformDisplayName){
                    expect(socket.removeHero).toHaveBeenCalledWith(hero.heroName);
                } else {
                    expect(socket.removeHero).not.toHaveBeenCalledWith(hero.heroName);
                }
            });
        });

        it('call popBlockingLoadingAction, to clear the pushed loading screen set in model.initialize', () => {
            expect(popBlockingLoadingAction).toHaveBeenCalled();
        });

        it('dispatch toggle walkthrough action', () => {
            expect(runWalkthrough).toHaveBeenCalled();
        });
    });

    describe('when user has no preferred heroes', () => {

        beforeEach(() => {
            getState = mockUtils.mockGetState(user);
            syncClientAndServerHeroesAsync(heroesFromServer, socket)(dispatch, getState);
        });

        it('should call preferMostPlayedHeroesAsync', () => {
            expect(getState().preferredHeroes.heroes).toEqual([]);
            expect(preferMostPlayedHeroesAsync).toHaveBeenCalledWith(user, localStorage.getItem('accessToken'), socket);
        });

        it('should not call addHeroesToServerAsync', () => {
            expect(getState().preferredHeroes.heroes).toEqual([]);
            expect(addHeroesToServerAsync).not.toHaveBeenCalled();
        });
    });

    describe('when user has no preferred heroes', () => {
        const preferredHeroes = ['reinhard', 'sombra'];

        beforeEach(() => {
            getState = mockUtils.mockGetState(user, preferredHeroes);
            syncClientAndServerHeroesAsync(heroesFromServer, socket)(dispatch, getState);
        });

        it('should not call preferMostPlayedHeroesAsync if user has preferred heroes', () => {
            expect(getState().preferredHeroes.heroes).toEqual(preferredHeroes);
            expect(preferMostPlayedHeroesAsync).not.toHaveBeenCalled();
        });

        it('should call addHeroesToServerAsync with preferred hero and socket', () => {
            expect(getState().preferredHeroes.heroes).toEqual(preferredHeroes);
            expect(addHeroesToServerAsync).toHaveBeenCalledWith(preferredHeroes, socket);
        });
    });
});