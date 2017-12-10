import model from './model';
import {createStore} from './store';
import {clientEvents} from '../api/websocket';
const mockSocket = require('socket-io-mock');

const token = {battleNetId: 'PwNShoPP', region: 'us', platform: 'pc'};
const initializeSocket = function() {
    let websocket = new mockSocket();
    websocket.addHero = function() {}; //stub
    return websocket;
};

let generateHero = function(heroName='hero', battleNetId=token.battleNetId) {
    return {battleNetId, heroName};
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
                let heroArray = [
                    generateHero('hero2')
                ];
                socket.socketClient.emit(clientEvents.initialData, heroArray);

                expect(store.getState().preferredHeroes).toEqual(heroArray);
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
                expect(store.getState().preferredHeroes).toEqual([hero]);
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
                model.addPreferredHero(hero);
                expect(store.getState().preferredHeroes).toEqual([hero]);
                expect(store.getState().heroes).toEqual([hero]);
            });

            it('should ignore duplicate heros', function() {
                let hero = generateHero();
                model.addPreferredHero(hero);
                model.addPreferredHero(hero);
                expect(store.getState().preferredHeroes).toEqual([hero]);
                expect(store.getState().heroes).toEqual([hero]);
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