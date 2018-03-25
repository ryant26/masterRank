import SocketIO from 'socket.io-client';
import logger from 'utilities/logger';
import { getSocketApiBase } from 'api/apiRouter';
const decode  = require('jwt-decode');
const clientEvents = require('shared/libs/socketEvents/clientEvents');
const serverEvents = require('shared/libs/socketEvents/serverEvents');

export default class Websocket {
    constructor(token, io = SocketIO) {
        this.authenticated = false;
        let tokenDecoded = decode(token);
        this.socket = io(getSocketApiBase(tokenDecoded));

        this.on(clientEvents.authenticated, () => {
            this.authenticated = true;
            logger.log('Authenticated: ');
            logger.log(`    User: ${tokenDecoded.platformDisplayName}`);
            logger.log(`    Region: ${tokenDecoded.region}`);
            logger.log(`    Platform: ${tokenDecoded.platform}`);
        });

        this.on(clientEvents.connect, () => {
            this.socket.emit(serverEvents.authenticate, token);
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

    groupLeave() {
        this.emit(serverEvents.groupLeave);
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