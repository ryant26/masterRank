const mockSocket = require('socket-io-mock');
import 'isomorphic-fetch';

import handleInitialData from './initialData';
import { createStore } from '../store';

import NotRealHeroes from '../../resources/metaListFillerHeroes';
import { getHeroes } from '../../resources/heroes';

const initializeSocket = function() {
    let websocket = new mockSocket();
    websocket.addHero = jest.fn();
    websocket.removeHero = jest.fn();
    return websocket;
};

let generateHero = function(heroName='hero', platformDisplayName, preference) {
  return {platformDisplayName, heroName, preference};
};

describe('handleInitialData', () => {

    const user = {platformDisplayName: 'Luckybomb#1470', region: 'us', platform: 'pc'};
    const userHeroesFromServer = [
         generateHero('tracer', user.platformDisplayName, 1),
         generateHero('mercy', user.platformDisplayName, 2)
    ];
    const nonUserHeroesFromServer = [
        generateHero('winston', 'cutie#1320', 1),
        generateHero('winston', 'nd44#5378', 1),
        generateHero('genji', 'nd44#5378', 2),
        generateHero('phara', 'nd44#5378', 3),
        generateHero('winston', 'PwNShoPP#8954', 1),
    ];
    const heroesFromServer = [...userHeroesFromServer, ...nonUserHeroesFromServer];

    let socket;
    let store;

    beforeEach(() => {
        store = createStore();
        socket = initializeSocket();
        store.getState().user = user;
    });

    describe('when user has preferred heroes', () => {
        const preferredHeroes = [
            'tracer',
            'phara'
        ];

        beforeEach(() => {
            store.getState().preferredHeroes.heroes = preferredHeroes;
        });

        it('should clear all existing heroes from the meta list, store.heroes', () => {
            store.getState().heroes = heroesFromServer;
            handleInitialData(socket, store, []);
            expect(store.getState().heroes).toEqual(NotRealHeroes);
        });

        it("heroes on the server that do not belong to the user should be added to store heroes", () => {
            handleInitialData(socket, store, heroesFromServer);
            expect(store.getState().heroes).toEqual([...NotRealHeroes, ...nonUserHeroesFromServer]);
        });

        it("heroes on the server that belong to the user should be removed from the server", () => {
            userHeroesFromServer.forEach((heroFromServer) => {
                expect(heroFromServer.platformDisplayName).toBe(user.platformDisplayName);
            });
            handleInitialData(socket, store, heroesFromServer);
            userHeroesFromServer.forEach((heroFromServer) => {
                expect(socket.removeHero).toHaveBeenCalledWith(heroFromServer.heroName);
            });
        });

        it("heroes on the server that do not belong to the user should not be removed from the server", () => {
            handleInitialData(socket, store, heroesFromServer);
            nonUserHeroesFromServer.forEach((heroFromServer) => {
                expect(socket.removeHero).not.toHaveBeenCalledWith(heroFromServer.heroName);
            });
        });

        it("user's preferred heroes should be added to the server", () => {
            handleInitialData(socket, store, heroesFromServer);
            preferredHeroes.forEach((preferredHero, i) => {
                expect(socket.addHero).toHaveBeenCalledWith(preferredHero, (i+1));
            });
        });

        it('should clear the loading state', () => {
            store.getState().loading.blockUI = 1;
            handleInitialData(socket, store, heroesFromServer);
            expect(store.getState().loading.blockUI).toBe(0);
        });

        it("heroes that do not belong to the user should not be added to preferred heroes", () => {
            handleInitialData(socket, store, heroesFromServer);
            expect(store.getState().preferredHeroes.heroes).toEqual(preferredHeroes);
        });
    });

    describe('when no heroes are preferred', () => {
        const mockLocalStorage = () => {
            window.localStorage = {
                getItem: jest.fn()
            };
        };
        const mockResponse = (status, statusText, jsonObj) => {
            return new Response(JSON.stringify(jsonObj), {
                status: status,
                statusText: statusText,
                headers: {
                    'Content-type': 'application/json'
                }
            });
        };
        const mostPlayedHeroes = getHeroes();


        beforeEach(() => {
            store.getState().preferredHeroes.heroes = [];
            mockLocalStorage();

            let fetchPromise = Promise.resolve(
                mockResponse(200, null, mostPlayedHeroes)
            );
            window.fetch = jest.fn().mockImplementation(() => fetchPromise);
            handleInitialData(socket, store, heroesFromServer);
            return fetchPromise;
        });

        it('should call fetch', () => {
            let platformDisplayName = user.platformDisplayName.replace(/#/g, '-');
            const apiUrl = `/api/heros?platformDisplayName=${platformDisplayName}&platform=${user.platform}&region=${user.region}&filterBy=top&limit=5`;
            const headers = {
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem('accessToken')}`
            }};
            expect(window.fetch).toHaveBeenCalledWith(apiUrl, headers);
        });

        it('should add the users most played heroes to the server when user api return at least 1 hero', () => {
            expect(mostPlayedHeroes.length).toBeGreaterThan(1);
            mostPlayedHeroes.forEach((hero, i) => {
                expect(socket.addHero).toHaveBeenCalledWith(hero.heroName, (i+1));
            });
        });

        it("should add all most played heroes to preferred heroes", () => {
            expect(store.getState().preferredHeroes.heroes).toEqual(mostPlayedHeroes.map((hero) => hero.heroName));
        });
    });
});