import { getMockSocket, generateMockUser } from '../../utilities/test/mockingUtilities';

import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction
} from "../loading";
jest.mock('../loading');
import fetchMostPlayedHeroes from '../../api/heroApi/fetchMostPlayedHeroes';
jest.mock('../../api/heroApi/fetchMostPlayedHeroes');
import { updateHeroes as updatePreferredHeroesAction } from "./preferredHeroes";
jest.mock('./preferredHeroes');
import { addHeroesToServer } from '../heroes/addHeroesToServer';
jest.mock('../heroes/addHeroesToServer');
import token from '../../resources/token';
import { getHeroes } from '../../resources/heroes';

import { preferMostPlayedHeroes } from './preferMostPlayedHeroes';

describe('preferMostPlayedHeroes', () => {
    const forUser = generateMockUser();
    const mostPlayedHeroesArray = getHeroes();
    let socket;
    let dispatch;
    let fetchPromise;

    afterEach(() => {
        fetchMostPlayedHeroes.mockClear();
        updatePreferredHeroesAction.mockClear();
        addHeroesToServer.mockClear();
        pushBlockingLoadingAction.mockClear();
        popBlockingLoadingAction.mockClear();
    });

    describe('when returns at least 1 hero', () => {
        const mostPlayedHeroNames = mostPlayedHeroesArray.map((hero) => hero.heroName);

        beforeEach(() => {
            socket = getMockSocket();
            dispatch = jest.fn();

            fetchPromise = Promise.resolve(mostPlayedHeroesArray);
            fetchMostPlayedHeroes.mockImplementation(() => fetchPromise);
            return preferMostPlayedHeroes(forUser, token, socket)(dispatch);
        });

        it('should dispatch pushBlockingLoadingAction', () => {
            expect(mostPlayedHeroNames.length).toBeGreaterThan(1);
            expect(dispatch).toHaveBeenCalledWith(pushBlockingLoadingAction());
        });

        it('should call fetchMostPlayedHeroes with user', () => {
            expect(mostPlayedHeroNames.length).toBeGreaterThan(1);
            expect(fetchMostPlayedHeroes).toHaveBeenCalledWith(forUser);
        });

        it("should updated preferred heroes with most played heroes' names", () => {
            expect(mostPlayedHeroNames.length).toBeGreaterThan(1);
            expect(updatePreferredHeroesAction).toHaveBeenCalledWith(mostPlayedHeroNames);
        });

        it('should add most played heroes to the server', () => {
            expect(mostPlayedHeroNames.length).toBeGreaterThan(1);
            expect(addHeroesToServer).toHaveBeenCalledWith(mostPlayedHeroNames, socket);
        });

        it('should clear loading screen', () => {
            expect(mostPlayedHeroNames.length).toBeGreaterThan(1);
            expect(popBlockingLoadingAction).toHaveBeenCalled();
        });

    });

    describe('when returns no heroes', () => {
        const noHeroesReturned = [];

        beforeEach(() => {
            socket = getMockSocket();
            dispatch = jest.fn();

            fetchPromise = Promise.resolve(noHeroesReturned);
            fetchMostPlayedHeroes.mockImplementation(() => fetchPromise);
            preferMostPlayedHeroes(forUser, token, socket)(dispatch);
            return fetchMostPlayedHeroes;
        });

        it('should not update preferred heroes', () => {
            expect(updatePreferredHeroesAction).not.toHaveBeenCalled();
        });

        it('should not add any heroes to the server', () => {
            expect(addHeroesToServer).not.toHaveBeenCalled();
        });

        it('should dispatch popBlockingLoadingAction', () => {
            expect(popBlockingLoadingAction).toHaveBeenCalled();
        });
    });

    describe('when fetch most played heroes promise is rejected', () => {
        const noHeroesReturned = [];

        beforeEach(() => {
            socket = getMockSocket();
            dispatch = jest.fn();

            fetchPromise = Promise.reject(noHeroesReturned);
            fetchMostPlayedHeroes.mockImplementation(() => fetchPromise);
            preferMostPlayedHeroes(forUser, token, socket)(dispatch);
            return fetchMostPlayedHeroes;
        });

        //TODO: Don't currently know how to make this test work.
        xit('should thrown fetch most played heroes failed error', () => {
            expect(fetchMostPlayedHeroes).toThrow(Error("fetchMostPlayedHeroes failed"));
        });

        it('should dispatch popBlockingLoadingAction', () => {
            expect(popBlockingLoadingAction).toHaveBeenCalled();
        });
    });
});