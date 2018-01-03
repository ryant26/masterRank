import io from 'socket.io-client';
import logger from '../utilities/logger';
const decode  = require('jwt-decode');

export const clientEvents = {
    initialData: 'initialData',
    authenticated: 'authenticated',
    heroAdded: 'heroAdded',
    groupInviteReceived: 'groupInviteRecieved'
};

const serverEvents = {
    authenticate: 'authenticate',
    addHero: 'addHero'
};

const websocketPort = '3004';

export default class Websocket {
    constructor(token) {
        this.authenticated = false;
        let tokenDecoded = decode(token);
        this.socket = io(`${window.location.hostname}:${websocketPort}/${tokenDecoded.region}/${tokenDecoded.platform}`);

        this.socket.emit(serverEvents.authenticate, token);

        this.on(clientEvents.authenticated, () => {
            this.authenticated = true;
            logger.log('Authenticated: ');
            logger.log(`    User: ${tokenDecoded.battleNetId}`);
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