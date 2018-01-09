import model from './model';
import {createStore} from './store';
import {clientEvents} from '../api/websocket';
const mockSocket = require('socket-io-mock');
const names = require('../../../shared/allHeroNames').names;


const token = {platformDisplayName: 'PwNShoPP', region: 'us', platform: 'pc'};
const initializeSocket = function() {
    let websocket = new mockSocket();
    websocket.addHero = function() {}; //stub
    return websocket;
};

let generateHero = function(heroName='hero', battleNetId=token.battleNetId, preference=1) {
    return {battleNetId, heroName, preference};
};

let generateInvite = function(id=1, groupLeader='PwNShoPP') {
    return {id, groupLeader};
};

let generateUser = function(battleNetId=token.battleNetId, region=token.region, platform=token.platform) {
    return {battleNetId, region, platform};
};

describe('Model', () => {
    let store;
    let socket;

    beforeEach(() => {
        store = createStore();
        socket = initializeSocket();
        model.initialize(socket, store);
        model.updateUser(token);
    });

    describe('Socket Events', () => {
        describe('Initial Data', () => {
            it('should add all heroes to the store', () => {
                let heroArray = [
                    generateHero('hero1', 'someUser'),
                    generateHero('hero2', 'someUser')
                    ];
                socket.socketClient.emit(clientEvents.initialData, heroArray);

                expect(store.getState().heroes).toEqual(heroArray);
            });

            it('should add heroes from the current user to the preferred heroes array', () => {
                let heroName = 'hero2';
                socket.socketClient.emit(clientEvents.initialData, [generateHero(heroName)]);

                expect(store.getState().preferredHeroes.heroes).toEqual([heroName]);
            });
        });

        describe('Hero Added', () => {
            it('should add the new hero to the store', function() {
                let hero = generateHero();
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().heroes).toEqual([hero]);
            });

            it('should ignore duplicate heros', function() {
                let hero = generateHero();
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().heroes).toEqual([hero]);
            });

            it('should add heroes from the current user to the preferred heroes array', function() {
                let hero = generateHero();
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName]);
            });

            it('should handle the error event for hero added', function() {
                const hero = 'tracer';
                model.addPreferredHero(hero, 1);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero]);

                socket.socketClient.emit(clientEvents.error.addHero, {heroName: hero});
                expect(store.getState().preferredHeroes.heroes).toEqual([]);
            });
        });

        describe('Group invite received', () => {
            it('should add the group invite to the list', () => {
                let invite = generateInvite();
                socket.socketClient.emit(clientEvents.groupInviteReceived, invite);
                expect(store.getState().groupInvites).toEqual([invite]);
            });

            it('should not add multiple invites with the same id to the list', () => {
                let invite = generateInvite();

                socket.socketClient.emit(clientEvents.groupInviteReceived, invite);
                socket.socketClient.emit(clientEvents.groupInviteReceived, invite);
                expect(store.getState().groupInvites).toEqual([invite]);
            });
        });
    });

    describe('Methods', () => {
        describe('addPreferredHero', function() {
            it('should add the new hero to the preferredHero and heroes array', function() {
                let hero = generateHero();
                model.addPreferredHero(hero.heroName, 1);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName]);
            });

            it('should insert the hero into the correct position in the heroes array', function() {
                let hero = generateHero('winston');
                model.addPreferredHero(generateHero('genji').heroName, 1);
                model.addPreferredHero(generateHero('tracer').heroName, 2);
                model.addPreferredHero(generateHero('widowmaker').heroName, 3);

                model.addPreferredHero(hero.heroName, 2);

                expect(store.getState().preferredHeroes.heroes).toEqual(['genji', 'winston', 'widowmaker']);
            });

            it('should ignore duplicate heros', function() {
                let hero = generateHero();
                model.addPreferredHero(hero.heroName, 1);
                model.addPreferredHero(hero.heroName, 2);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName]);
            });

            it('should increment the selectedSlot', function() {
                let hero = generateHero();
                model.addPreferredHero(hero.heroName, 1);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName]);
                expect(store.getState().preferredHeroes.selectedSlot).toEqual(2);
            });

            it('should not increment the selectedSlot passed the maximum slots', function() {
                let hero = generateHero('winston');
                model.addPreferredHero(generateHero('genji').heroName, 1);
                model.addPreferredHero(generateHero('tracer').heroName, 2);
                model.addPreferredHero(generateHero('widowmaker').heroName, 3);
                model.addPreferredHero(generateHero('soldier76').heroName, 4);

                model.addPreferredHero(hero.heroName, 5);
                expect(store.getState().preferredHeroes.selectedSlot).toEqual(5);
            });

            it('should not increment the selectedSlot when passed a duplicate hero', function() {
                model.addPreferredHero(generateHero('genji').heroName, 1);
                model.addPreferredHero(generateHero('genji').heroName, 2);

                expect(store.getState().preferredHeroes.selectedSlot).toEqual(2);
            });
        });

        describe('setSelectedSlotInStore', function() {
            let setupStore = function(numHeroes) {
                for (let i = 0; i < numHeroes; i++) {
                    model.addPreferredHero(generateHero(`hero${i + 1}`), i + 1);
                }
            };

            it('should select any slot for which a hero is chosen', function(done) {
                let selectedSlot = 3;
                setupStore(5);
                model.setSelectedSlotInStore(selectedSlot);

                expect(store.getState().preferredHeroes.selectedSlot).toEqual(selectedSlot);
                done();
            });

            it('should choose the lowest empty slot when a higher slot is chosen', function(done) {
                let selectedSlot = 4;
                setupStore(2);
                model.setSelectedSlotInStore(selectedSlot);

                expect(store.getState().preferredHeroes.selectedSlot).toEqual(3);
                done();
            });
        });

        describe('addHeroFilter', function() {
            it('should add the new filter to the filters array', function() {
                let filter = names[0];
                model.addHeroFilterToStore(filter);
                expect(store.getState().heroFilters).toEqual([filter]);
            });
        });

        describe('removeHeroFilter', function() {
            it('should remove the filter from the filters array', function() {
                let filter = names[0];
                model.addHeroFilterToStore(filter);
                model.addHeroFilterToStore(names[1]);
                model.removeHeroFilterFromStore(filter);
                expect(store.getState().heroFilters).toEqual([names[1]]);
            });
        });

        describe('updateUser', () => {
            it('should set the user object in the state', () => {
                let user = generateUser('someRandomID');
                model.updateUser(user);
                expect(store.getState().user).toEqual(user);
            });

            it('should replace the user if one is already set', () => {
                let user = generateUser('someRandomID');
                let user2 = generateUser('anotherRandomId');

                expect(user2).not.toEqual(user);

                model.updateUser(user);
                model.updateUser(user2);

                expect(store.getState().user).toEqual(user2);
            });
        });
    });
});