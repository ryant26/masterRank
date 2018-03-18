import { getMockSocket, generateMockUser } from 'utilities/test/mockingUtilities';

import {
    pushBlockingEvent as pushBlockingLoadingAction,
    popBlockingEvent as popBlockingLoadingAction
} from "actionCreators/loading";
jest.mock('actionCreators/loading');
import fetchMostPlayedHeroesAsync from 'api/heroApi/fetchMostPlayedHeroesAsync';
jest.mock('api/heroApi/fetchMostPlayedHeroesAsync');
import { updateHeroes as updatePreferredHeroesAction } from "actionCreators/preferredHeroes/preferredHeroes";
jest.mock('actionCreators/preferredHeroes/preferredHeroes');
import { addHeroesToServerAsync } from 'actionCreators/heroes/addHeroesToServerAsync';
jest.mock('actionCreators/heroes/addHeroesToServerAsync');
import token from 'resources/token';
import { getHeroes } from 'resources/heroes';

import { preferMostPlayedHeroesAsync } from 'actionCreators/preferredHeroes/preferMostPlayedHeroesAsync';

describe('preferMostPlayedHeroesAsync', () => {
    const forUser = generateMockUser();
    const mostPlayedHeroesArray = getHeroes();
    let socket;
    let dispatch;
    let fetchPromise;

    afterEach(() => {
        fetchMostPlayedHeroesAsync.mockClear();
        updatePreferredHeroesAction.mockClear();
        addHeroesToServerAsync.mockClear();
        pushBlockingLoadingAction.mockClear();
        popBlockingLoadingAction.mockClear();
    });

    describe('when returns at least 1 hero', () => {
        const mostPlayedHeroNames = mostPlayedHeroesArray.map((hero) => hero.heroName);

        beforeEach(() => {
            socket = getMockSocket();
            dispatch = jest.fn();

            fetchPromise = Promise.resolve(mostPlayedHeroesArray);
            fetchMostPlayedHeroesAsync.mockImplementation(() => fetchPromise);
            return preferMostPlayedHeroesAsync(forUser, token, socket)(dispatch);
        });

        it('should dispatch pushBlockingLoadingAction', () => {
            expect(mostPlayedHeroNames.length).toBeGreaterThan(1);
            expect(dispatch).toHaveBeenCalledWith(pushBlockingLoadingAction());
        });

        it('should call fetchMostPlayedHeroesAsync with user', () => {
            expect(mostPlayedHeroNames.length).toBeGreaterThan(1);
            expect(fetchMostPlayedHeroesAsync).toHaveBeenCalledWith(forUser);
        });

        it("should updated preferred heroes with most played heroes' names", () => {
            expect(mostPlayedHeroNames.length).toBeGreaterThan(1);
            expect(updatePreferredHeroesAction).toHaveBeenCalledWith(mostPlayedHeroNames);
        });

        it('should add most played heroes to the server', () => {
            expect(mostPlayedHeroNames.length).toBeGreaterThan(1);
            expect(addHeroesToServerAsync).toHaveBeenCalledWith(mostPlayedHeroNames, socket);
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
            fetchMostPlayedHeroesAsync.mockImplementation(() => fetchPromise);
            preferMostPlayedHeroesAsync(forUser, token, socket)(dispatch);
            return fetchMostPlayedHeroesAsync;
        });

        it('should not update preferred heroes', () => {
            expect(updatePreferredHeroesAction).not.toHaveBeenCalled();
        });

        it('should not add any heroes to the server', () => {
            expect(addHeroesToServerAsync).not.toHaveBeenCalled();
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
            fetchMostPlayedHeroesAsync.mockImplementation(() => fetchPromise);
            preferMostPlayedHeroesAsync(forUser, token, socket)(dispatch);
            return fetchMostPlayedHeroesAsync;
        });

        //TODO: Don't currently know how to make this test work.
        xit('should thrown fetch most played heroes failed error', () => {
            expect(fetchMostPlayedHeroesAsync).toThrow(Error("fetchMostPlayedHeroesAsync failed"));
        });

        it('should dispatch popBlockingLoadingAction', () => {
            expect(popBlockingLoadingAction).toHaveBeenCalled();
        });
    });
});