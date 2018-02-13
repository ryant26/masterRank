import io from 'socket.io-client';
import logger from '../utilities/logger';
import {getSocketApiBase} from './apiRouter';
const decode  = require('jwt-decode');

export const clientEvents = {
    initialData: 'initialData',
    authenticated: 'authenticated',
    heroAdded: 'heroAdded',
    heroRemoved: 'heroRemoved',
    groupPromotedLeader: 'groupPromotedLeader',
    groupInviteReceived: 'groupInviteRecieved',
    groupHeroLeft: 'groupHeroLeft',
    playerInvited: 'playerInvited',
    groupInviteAccepted: 'groupInviteAccepted',
    groupInviteCanceled: 'groupInviteCanceled',
    groupInviteDeclined: 'groupInviteDeclined',
    error: {
        addHero: 'error.addHero',
        groupLeave: 'error.groupLeave',
        groupInviteAccept: 'error.groupInviteAccept',
        groupInviteCancel: 'error.groupInviteCancel',
        groupInviteDeclined: 'error.groupInviteDeclined'
    }
};

const serverEvents = {
    authenticate: 'authenticate',
    addHero: 'addHero',
    removeHero: 'removeHero',
    createGroup: 'createGroup',
    groupLeave: 'groupLeave',
    groupInviteSend: 'groupInviteSend',
    groupInviteDecline: 'groupInviteDecline',
    groupInviteAccept: 'groupInviteAccept',
    groupInviteCancel: 'groupInviteCancel'
};


export default class Websocket {
    constructor(token) {
        this.authenticated = false;
        let tokenDecoded = decode(token);
        this.socket = io(getSocketApiBase(tokenDecoded));

        this.socket.emit(serverEvents.authenticate, token);

        this.on(clientEvents.authenticated, () => {
            this.authenticated = true;
            logger.log('Authenticated: ');
            logger.log(`    User: ${tokenDecoded.platformDisplayName}`);
            logger.log(`    Region: ${tokenDecoded.region}`);
            logger.log(`    Platform: ${tokenDecoded.platform}`);
        });
    }

    disconnect() {
        this.socket.close();
    }

    addHero(heroName, priority) {
        this.emit(serverEvents.addHero, {heroName, priority});
    }

    removeHero(heroName) {
        this.emit(serverEvents.removeHero, heroName);
    }

    groupInviteSend(userObject) {
        this.emit(serverEvents.groupInviteSend, userObject);
    }

    createGroup(heroName) {
        this.emit(serverEvents.createGroup, {heroName});
    }

    groupLeave(groupId) {
        this.emit(serverEvents.groupLeave, groupId);
    }

    groupInviteAccept(groupId) {
        this.emit(serverEvents.groupInviteAccept, groupId);
    }

    groupInviteCancel(userObject) {
        this.emit(serverEvents.groupInviteCancel, userObject);
    }

    groupInviteDecline(groupId) {
        this.emit(serverEvents.groupInviteDecline, groupId);
    }

    on(event, cb) {
        if (!clientEvents[event]) {
            logger.warn(`Handling unregistered event: ${event}`);
        }
        this.socket.on(event, cb);
    }

    emit(event, data) {
        if (!serverEvents[event]) {
            logger.warn(`Emitting unregistered event: ${event}`);
        }

        if (!this.authenticated) {
            logger.error('Emitting event before being authenticated');
        }

        this.socket.emit(event, data);
    }


}