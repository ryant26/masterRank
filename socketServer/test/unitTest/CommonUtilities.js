const io = require('socket.io-client');
const config = require('config');
const randomString = require('randomstring');
const serverEvents = require('../../src/socketEvents/serverEvents');
const clientEvents = require('../../src/socketEvents/clientEvents');
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

    getAuthenticatedSocket(battleNetId, region = this.regions.us, platform = 'pc') {
        let outSocket = io(this.getSocketUrl(region, platform), {forceNew: true});
        outSocket.emit('authenticate', {battleNetId: battleNetId, region, platform});
        this.socketsArray.push(outSocket);
        return outSocket;
    }

    closeOpenedSockets() {
        this.socketsArray.forEach((socket) => {
            try{
                socket.close();
            } catch (err) {
                logger.warn('Failed to close a socket');
            }
        });
    }

    getEmptyGroup(region) {
        return new Promise((resolve) => {
            let out = {
                leaderHero: {
                    battleNetId: randomString.generate(),
                    heroName: randomString.generate()
                }
            };

            out.leaderSocket = this.getAuthenticatedSocket(out.leaderHero.battleNetId, region);

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

            out.leaderSocket.on(clientEvents.groupPromotedLeader, () => {
                for (let i = 0; i < numberOfGroupMembers; i++) {
                    let member = {
                        battleNetId: randomString.generate(),
                        heroName: randomString.generate()
                    };


                    let memberSocket = this.getAuthenticatedSocket(member.battleNetId, region);

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
                        out.leaderSocket.removeAllListeners(clientEvents.groupPromotedLeader);
                        resolve(out);
                    }
                });
            });
        });
    }

    getUserWithAddedHero(battleNetId, heroName, region) {
        return new Promise((resolve) => {
            let hero =  {
                battleNetId: battleNetId || randomString.generate(),
                heroName: heroName || randomString.generate()
            };

            let socket = this.getAuthenticatedSocket(hero.battleNetId, region);

            socket.on(clientEvents.heroAdded, (addedHero) => {
                if (addedHero.battleNetId === hero.battleNetId) {
                    socket.removeAllListeners(clientEvents.initialData);
                    socket.removeAllListeners(clientEvents.heroAdded);
                    resolve({
                        hero,
                        socket
                    });
                }
            });

            socket.on(clientEvents.initialData, () => {
                socket.emit(serverEvents.addHero, hero.heroName);
            });
        });
    }
};