const io = require('socket.io-client');
const config = require('config');
const randomString = require('randomstring');
const serverEvents = require('../../src/socketEvents/serverEvents');
const clientEvents = require('../../src/socketEvents/clientEvents');
const logger = require('winston');

const connectionUrl = `${config.get('url')}:${config.get('port')}`;
const connectionUrlUs = `${connectionUrl}/us`;
const connectionUrlEu = `${connectionUrl}/eu`;
const connectionUrlAs = `${connectionUrl}/as`;

let battleNetId = 'testUser#1234';

let socketsArray = [];

let getAuthenticatedSocket = function (battleNetId, socketUrl) {
    let outSocket = io(socketUrl, {forceNew: true});
    outSocket.emit('authenticate', {battleNetId: battleNetId});
    socketsArray.push(outSocket);
    return outSocket;
};

let closeOpenedSockets = function () {
    socketsArray.forEach((socket) => {
        try{
            socket.close();
        } catch (err) {
            logger.warn('Failed to close a socket');
        }
    });
};

let getEmptyGroup = function(connectionUrl) {
    return new Promise((resolve) => {
        let out = {
            leaderHero: {
                battleNetId: randomString.generate(),
                heroName: randomString.generate()
            }
        };

        out.leaderSocket = getAuthenticatedSocket(out.leaderHero.battleNetId, connectionUrl || connectionUrlUs);

        out.leaderSocket.on(clientEvents.initialData, () => {
            out.leaderSocket.emit(serverEvents.addHero, out.leaderHero.heroName);
        });

        out.leaderSocket.on(clientEvents.heroAdded, () => {
            out.leaderSocket.emit(serverEvents.createGroup, out.leaderHero);
        });

        out.leaderSocket.on(clientEvents.groupPromotedLeader, (groupDetails) => {
            out.leaderSocket.removeAllListeners(clientEvents.initialData);
            out.leaderSocket.removeAllListeners(clientEvents.heroAdded);
            out.leaderSocket.removeAllListeners(clientEvents.groupPromotedLeader);
            out.groupDetails = groupDetails;
            resolve(out);
        });
    });
};

let getFilledGroup = function (numberOfGroupMembers, connectionUrl) {
    let out = {
        memberSockets: [],
        memberHeros: []
    };

    out.leaderSocket = getAuthenticatedSocket(battleNetId, connectionUrl || connectionUrlUs);

    out.leaderHero = {
        battleNetId: randomString.generate(),
        heroName: randomString.generate()
    };

    out.leaderSocket.emit(serverEvents.createGroup, out.leaderHero);

    out.leaderSocket.on(clientEvents.heroAdded, (hero) => {
        out.memberHeros.push(hero);
        out.leaderSocket.emit(serverEvents.groupInviteSend, hero);
    });

    out.leaderSocket.on(clientEvents.groupPromotedLeader, () => {
        for (let i = 0; i < numberOfGroupMembers; i++) {
            let member = {
                battleNetId: randomString.generate(),
                heroName: randomString.generate()
            };


            let memberSocket = getAuthenticatedSocket(member.battleNetId, connectionUrl || connectionUrlUs);

            memberSocket.on(clientEvents.initialData, () => {
                memberSocket.emit(serverEvents.addHero, member.heroName);
            });

            memberSocket.on(clientEvents.groupInviteReceived, (group) => {
                memberSocket.emit(serverEvents.groupInviteAccept, group.groupId);
                memberSocket.removeAllListeners(clientEvents.groupInviteReceived);
                memberSocket.removeAllListeners(clientEvents.initialData);
            });

            out.memberSockets.push(memberSocket);
        }
    });

    return new Promise((resolve) => {
        out.leaderSocket.on(clientEvents.groupInviteAccepted, (groupDetails) => {
            if(groupDetails.members.length === numberOfGroupMembers){
                out.leaderSocket.removeAllListeners(clientEvents.groupInviteAccepted);
                out.leaderSocket.removeAllListeners(clientEvents.heroAdded);
                resolve(out);
            }
        });
    });
};

let getUserWithAddedHero = function(battleNetId, heroName, connectionUrl) {
    return new Promise((resolve) => {
        let hero =  {
            battleNetId: battleNetId || randomString.generate(),
            heroName: heroName || randomString.generate()
        };

        let socket = getAuthenticatedSocket(hero.battleNetId, connectionUrl || connectionUrlUs);

        socket.on(clientEvents.initialData, () => {
            socket.emit(serverEvents.addHero, hero.heroName);
        });

        socket.on(clientEvents.heroAdded, () => {
            socket.removeAllListeners(clientEvents.initialData);
            socket.removeAllListeners(clientEvents.heroAdded);
            resolve({
                hero,
                socket
            });
        });
    });
};

module.exports = {
    connectionUrlUs,
    connectionUrlEu,
    connectionUrlAs,
    getAuthenticatedSocket,
    closeOpenedSockets,
    getEmptyGroup,
    getFilledGroup,
    getUserWithAddedHero
};