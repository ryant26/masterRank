import model from './model';
import {createStore} from './store';
import {clientEvents} from '../api/websocket';
const mockSocket = require('socket-io-mock');
const names = require('../../../shared/allHeroNames').names;


const token = {platformDisplayName: 'PwNShoPP', region: 'us', platform: 'pc'};
const initializeSocket = function() {
    let websocket = new mockSocket();
    websocket.addHero = function() {}; //stub
    websocket.createGroup = function() {}; // stub
    return websocket;
};

let generateHero = function(heroName='hero', platformDisplayName=token.platformDisplayName, preference=1) {
    return {platformDisplayName, heroName, preference};
};

let generateInvite = function(id=1, groupLeader='PwNShoPP') {
    return {id, groupLeader};
};

let generateUser = function(platformDisplayName=token.platformDisplayName, region=token.region, platform=token.platform) {
    return {platformDisplayName, region, platform};
};

// let generateGroup = function() {

// };

describe('Model', () => {
    let store;
    let socket;

    beforeEach(() => {
        store = createStore();
        socket = initializeSocket();
        model.initialize(socket, store);
        model.updateUser(token);
    });

    describe('Constructor', () => {
        it('should set the loading state', () => {
            expect(store.getState().loading.blockUI).toBeTruthy();
        });
    });

    describe('Socket Events', () => {
        describe('Authenticated', () => {
            xit('should add preferred heroes from local storage', () => {
                model.loadPreferredHeroesFromLocalStorage = jest.fn();
                //Todo: cant figure out how to mock our websocket.js constructor
                socket.socketClient.emit(clientEvents.authenticated, true);
                expect(model.loadPreferredHeroesFromLocalStorage).toHaveBeenCalled();
            });
        });

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

            it('should clear the loading state', () => {
                expect(store.getState().loading.blockUI).toBeTruthy();

                let heroArray = [
                    generateHero('hero1', 'someUser'),
                    generateHero('hero2', 'someUser')
                ];
                socket.socketClient.emit(clientEvents.initialData, heroArray);

                expect(store.getState().loading.blockUI).toBeFalsy();
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

            xit('should create a new group for the current user if the hero added is the first preferred hero', () => {
                let heroObject = 'hero';
                model.addPreferredHero(heroObject, 1);
                socket.socketClient.emit(clientEvents.createGroup, heroObject);
                expect(store.getState().group.leader).toEqual({
                    platformDisplayName: 'PwNShoPP', 
                    heroName: heroObject
                });
            });

            xit('should promote leader of the group for the current user if the hero added replaces the first preferred hero', () => {

            });
        });

        describe('heroRemoved', () => {
            it('should add the new hero to the store', function() {
                let hero = generateHero();
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().heroes).toEqual([hero]);
                socket.socketClient.emit(clientEvents.heroRemoved, hero);
                expect(store.getState().heroes).toEqual([]);
            });

            it('should remove heroes from the preferred hero array too', function() {
                let hero = generateHero();
                socket.socketClient.emit(clientEvents.heroAdded, hero);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName]);
                socket.socketClient.emit(clientEvents.heroRemoved, hero);
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

        describe('Group Promoted Leader', () => {
            xit('should update the group with a new leader', () => {
                // let promotedLeaderObject = generateLeaderGroup();
                // socket.socketClient.emit(clientEvents.groupPromotedLeader, promotedLeaderObject);
                // expect(store.getState().group).toEqual(promotedLeaderObject);
            });
        });

        describe('Player Invited', () => {
            xit('should update the group with a new pending user', () => {
            //     let groupInvitePendingObject = generatePendingObject();
            //     socket.socketClient.emit(clientEvents.groupPromotedLeader, groupInvitePendingObject);
            //     expect(store.getState().group).toEqual(groupInvitePendingObject);
            });
        });

        describe('Group Hero Left', () => {
            xit('should update the group by removing the specified user', () => {
            //     let groupHeroExistsObject = generateCurrentGroup();
            //     expect(store.getState().group).toEqual(groupHeroExistsObject);

            //     let groupHeroLeftObject = generateLeftObject();
            //     socket.socketClient.emit(clientEvents.groupPromotedLeader, groupHeroLeftObject);
            //     expect(store.getState().group).toEqual(groupHeroLeftObject);
            });
        });

        describe('Group Invite Canceled', () => {
            xit('should remove the specified pending hero from the group', () => {
            //     let groupHeroCancelledObject = generateCanceledObject();
            //     socket.socketClient.emit(clientEvents.groupInviteCanceled, groupHeroCancelledObject);
            //     expect(store.getState().group).toEqual(groupHeroCancelledObject);
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
        });

        describe('updatePreferredHeroes', function() {
            beforeEach(() => {
                socket.removeHero = () => {}; //Stub
            });

            it('should update the preferred heroes array to the argument', function() {
                let hero = generateHero();
                let hero2 = generateHero('hero2');
                model.updatePreferredHeroes([hero.heroName, hero2.heroName]);
                expect(store.getState().preferredHeroes.heroes).toEqual([hero.heroName, hero2.heroName]);
            });

            it('Should send the removeHero socket event for missing heroes', function(done) {
                let hero = generateHero('winston');
                socket.removeHero = function(heroName) {
                    expect(heroName).toBe('genji');
                    done();
                };

                model.addPreferredHero(generateHero('genji').heroName, 1);
                model.addPreferredHero(generateHero('tracer').heroName, 2);
                model.addPreferredHero(generateHero('widowmaker').heroName, 3);

                model.updatePreferredHeroes([hero.heroName, 'tracer', 'widowmaker']);
            });

            it('should send the addHero socket event for new heroes', function(done) {
                let hero = generateHero('winston');

                model.addPreferredHero(generateHero('genji').heroName, 1);
                model.addPreferredHero(generateHero('tracer').heroName, 2);
                model.addPreferredHero(generateHero('widowmaker').heroName, 3);

                socket.addHero = function(heroName, preference) {
                    expect(heroName).toBe('winston');
                    expect(preference).toBe(1);
                    done();
                };

                model.updatePreferredHeroes([hero.heroName, 'tracer', 'widowmaker']);
            });

            it('should remove extra heroes when the new array is shorter', (done) => {

                model.addPreferredHero(generateHero('genji').heroName, 1);
                model.addPreferredHero(generateHero('tracer').heroName, 2);
                model.addPreferredHero(generateHero('widowmaker').heroName, 3);

                socket.removeHero = function(heroName) {
                    expect(heroName).toBe('widowmaker');
                    done();
                };

                model.updatePreferredHeroes(['genji', 'tracer']);
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

        describe('createNewGroup', () => {
            xit('should fire createGroup socket event', () => {

            });
            xit('should set a new group in the state with group leader', () => {

            });
        });

        describe('inviteUserToGroup', () => {
            xit('should fire groupInviteSend socket event', () => {

            });
            xit('should set a new group in the state with invited user', () => {

            });
        });

        describe('leaveGroup', () => {
            xit('should fire groupLeave socket event', () => {

            });
            xit('should return the same group with the missing user', () => {

            });
        });

        describe('cancelInvite', () => {
            xit('should fire cancelInvite socket event', () => {

            });
            xit('should set a new group in the state with pending user missing', () => {

            });
        });

    });
});