const io = require('socket.io-client');
const config = require('config');
const randomString = require('randomstring');
const serverEvents = require('../../../shared/libs/socketEvents/serverEvents');
const clientEvents = require('../../../shared/libs/socketEvents/clientEvents');
const jwt = require('jsonwebtoken');
const logger = require('winston');

module.exports = class CommonUtilities {

    constructor(opts) {
        if (opts) {
            this.connectionUrl = opts.url;
        }

        this.connectionUrl = this.connectionUrl || `${config.get('url')}:${config.get('port')}`;
        this.socketsArray = [];
        this.regions = {
            us: 'us',
            eu: 'eu',
            as: 'apac'
        };
    }

    getSocketUrl(region, platform) {
        return `${this.connectionUrl}/${region}/${platform}`;
    }

    getAuthenticatedSocket(platformDisplayName, region, platform) {
        return this.getSocket(platformDisplayName, region, platform).authenticate();
    }

    getSocket(platformDisplayName, region = this.regions.us, platform = 'pc') {
        let self = this;
        let outSocket = io(this.getSocketUrl(region, platform), {reconnect: true, forceNew: true, secure: true, rejectUnauthorized: false});

        outSocket.authenticate = function() {
            return new Promise((resolve) => {
                outSocket.on(clientEvents.initialData, (data) => {
                    self.socketsArray.push(outSocket);
                    resolve({socket: outSocket, initialData: data});
                });

                outSocket.emit(serverEvents.authenticate, jwt.sign({platformDisplayName, region, platform}, 'secret'));
            });
        };

        return outSocket;
    }

    closeOpenedSockets() {
        let sockets = this.socketsArray;
        this.socketsArray = [];
        return Promise.all(sockets.map((socket) => {
            return new Promise((resolve, reject) => {
                try{
                    socket.on('disconnect', () => {
                        resolve();
                    });
                    socket.close();
                } catch (err) {
                    logger.warn('Failed to close a socket');
                    reject();
                }
            });
        }));
    }

    getEmptyGroup(region) {
        return new Promise((resolve) => {
            let out = {
                leaderHero: {
                    platformDisplayName: randomString.generate(),
                    heroName: 'genji'
                }
            };

            this.getAuthenticatedSocket(out.leaderHero.platformDisplayName, region).then(({socket}) => {
                out.leaderSocket = socket;

                out.leaderSocket.on(clientEvents.heroAdded, () => {
                    out.leaderSocket.emit(serverEvents.createGroup, out.leaderHero);
                });

                out.leaderSocket.on(clientEvents.newGroupCreated, (groupDetails) => {
                    out.leaderSocket.removeAllListeners(clientEvents.initialData);
                    out.leaderSocket.removeAllListeners(clientEvents.heroAdded);
                    out.leaderSocket.removeAllListeners(clientEvents.newGroupCreated);
                    out.groupDetails = groupDetails;
                    resolve(out);
                });

                out.leaderSocket.emit(serverEvents.addHero, {heroName: out.leaderHero.heroName, priority: 1});
            });
        });
    }

    getFilledGroup(numberOfGroupMembers, region) {
        let out = {
            memberSockets: [],
            memberHeros: []
        };

        return out.leaderSocket = this.getUserWithAddedHero(null, null, region).then((leader) => {
            out.leaderHero = leader.hero;
            out.leaderSocket = leader.socket;

            out.leaderSocket.emit(serverEvents.createGroup, out.leaderHero);

            out.leaderSocket.on(clientEvents.heroAdded, (hero) => {
                out.memberHeros.push(hero);
                out.leaderSocket.emit(serverEvents.groupInviteSend, hero);
            });

            out.leaderSocket.on(clientEvents.newGroupCreated, () => {
                for (let i = 0; i < numberOfGroupMembers; i++) {
                    let member = {
                        platformDisplayName: randomString.generate(),
                        heroName: 'mei'
                    };


                    this.getAuthenticatedSocket(member.platformDisplayName, region).then((data) => {
                        let memberSocket = data.socket;

                        memberSocket.on(clientEvents.groupInviteReceived, (group) => {
                            memberSocket.emit(serverEvents.groupInviteAccept, group.groupId);
                            memberSocket.removeAllListeners(clientEvents.groupInviteReceived);
                            memberSocket.removeAllListeners(clientEvents.initialData);
                        });

                        out.memberSockets.push(memberSocket);

                        memberSocket.emit(serverEvents.addHero, {heroName: member.heroName, priority: 1});

                    });
                }
            });

            return new Promise((resolve) => {
                out.leaderSocket.on(clientEvents.groupInviteAccepted, (groupDetails) => {
                    if(groupDetails.members.length === numberOfGroupMembers){
                        out.leaderSocket.removeAllListeners(clientEvents.groupInviteAccepted);
                        out.leaderSocket.removeAllListeners(clientEvents.heroAdded);
                        out.leaderSocket.removeAllListeners(clientEvents.newGroupCreated);
                        resolve(out);
                    }
                });
            });
        });
    }

    getUserWithAddedHero(platformDisplayName, heroName, region) {
        return new Promise((resolve) => {
            let hero =  {
                platformDisplayName: platformDisplayName || randomString.generate(),
                heroName: heroName || 'winston'
            };

            this.getAuthenticatedSocket(hero.platformDisplayName, region).then(({socket}) => {
                socket.on(clientEvents.heroAdded, (addedHero) => {
                    if (addedHero.platformDisplayName === hero.platformDisplayName) {
                        socket.removeAllListeners(clientEvents.initialData);
                        socket.removeAllListeners(clientEvents.heroAdded);
                        resolve({
                            hero,
                            socket
                        });
                    }
                });

                socket.emit(serverEvents.addHero, {heroName: hero.heroName, priority: 1});
            });
        });
    }
};