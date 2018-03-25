const serverEvents = {
    connection: 'connection',
    authenticate: 'authenticate',
    addHero: 'addHero',
    removeHero: 'removeHero',
    groupInviteSend: 'groupInviteSend',
    createGroup: 'createGroup',
    groupInviteAccept: 'groupInviteAccept',
    groupInviteDecline: 'groupInviteDecline',
    groupInviteCancel: 'groupInviteCancel',
    groupLeave: 'groupLeave',
    disconnect: 'disconnect'
};

module.exports = serverEvents;
