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

const _groupLeader = {
    platformDisplayName: 'PwNShoPP',
    heroName: 'genji'
};

const _groupMember = {
    platformDisplayName: 'wisesm0#1147',
    heroName: 'dva'
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

let generateGroup = function(groupId=1, leader=_groupLeader, members=[], pending=[]) {
    return {
        groupId: groupId,
        leader: leader,
        members: members,
        pending: pending
    };
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

            it('should create a new group for the current user if the hero added is the first preferred hero', () => {
                // TODO: this test is kinda hard to do
            });

            xit('should promote leader of the group for the current user if the hero added replaces the first preferred hero', () => {
                // TODO: this test is kinda hard to do
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
            let initialLeader;
            let promotedLeaderObject;

            beforeEach(() => {
                initialLeader = store.getState().group.leader;
                promotedLeaderObject = generateGroup();
                socket.socketClient.emit(clientEvents.groupPromotedLeader, promotedLeaderObject);                
            });

            it('should update the group', () => {
                expect(store.getState().group).toEqual(promotedLeaderObject);
            });

            it('should change store group leader', () => {
                expect(store.getState().group.leader).not.toEqual(initialLeader);
            });
        });

        describe('Player Invited', () => {
            let initialPending;
            let groupInvitePendingObject;

            beforeEach(() => {
                initialPending = store.getState().group.pending;
                groupInvitePendingObject = generateGroup(1,_groupLeader,[],[_groupMember]);
                socket.socketClient.emit(clientEvents.playerInvited, groupInvitePendingObject);
            });

            it('should update the group store with passed object pending', () => {
                expect(store.getState().group).toEqual(groupInvitePendingObject);
            });

            it ('should change the store group pending object', () => {
                expect(store.getState().group.pending).not.toEqual(initialPending);
            });
        });

        describe('Group Hero Left', () => {
            let initialMembers;
            let groupHeroLeftObject;

            beforeEach(() => {
                initialMembers = store.getState().group.members;
                groupHeroLeftObject = generateGroup(1,_groupLeader,[_groupMember],[]);
                socket.socketClient.emit(clientEvents.groupHeroLeft, groupHeroLeftObject);
            });

            it('should update the group', () => {
                expect(store.getState().group).toEqual(groupHeroLeftObject);
            });

            it('should change the store group member object', () => {
                expect(store.getState().group.members).not.toEqual(initialMembers);
             });

             xit('should handle group leave error event', () => {
                // TODO: does nothing right now
            });
        });

        describe('Group Invite Canceled', () => {
            let initialPending;
            let groupHeroCancelledObject;

            beforeEach(() => {
                initialPending = store.getState().group.pending;
                groupHeroCancelledObject = generateGroup(1,_groupLeader,[],[_groupMember]);
                socket.socketClient.emit(clientEvents.groupInviteCanceled, groupHeroCancelledObject);
            });

            it('should update the group', () => {
                expect(store.getState().group).toEqual(groupHeroCancelledObject);
            });

            it('should change the store group pending object', () => {
                expect(store.getState().group.pending).not.toEqual(initialPending);
            });

            xit('should handle group cancel error event', () => {
                // TODO: does nothing right now
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
                // expect(socket.createGroup).isCalled();
            });
            xit('should set a new group in the state with your hero as group leader', () => {
                // TODO: this test is kinda hard to do
            });
        });

        describe('inviteUserToGroup', () => {
            xit('should fire groupInviteSend socket event', () => {

            });
            xit('should set a new group in the state with invited user', () => {
                // TODO: this test is kinda hard to do
            });
        });

        describe('leaveGroup', () => {
            xit('should fire groupLeave socket event', () => {

            });
            xit('should remove the current user from the group specified', () => {
                // TODO: this test is kinda hard to do
            });
        });

        describe('cancelInvite', () => {
            xit('should fire cancelInvite socket event', () => {

            });
            xit('should set a new group in the state with pending user missing', () => {
                // TODO: this test is kinda hard to do
            });
        });

    });
});