const clientEvents = {
    authenticated: 'authenticated',
    initialData: 'initialData',
    heroAdded: 'heroAdded',
    heroRemoved: 'heroRemoved',
    groupInviteReceived: 'groupInviteReceived',
    playerInvited: 'playerInvited',
    groupDiscordAdded: 'groupDiscordAdded',
    groupInviteCanceled: 'groupInviteCanceled',
    playerInviteCanceled: 'playerInviteCanceled',
    groupInviteAccepted: 'groupInviteAccepted',
    groupInviteDeclined: 'groupInviteDeclined',
    playerHeroLeft: 'playerHeroLeft',
    groupPromotedLeader: 'groupPromotedLeader',
    newGroupCreated: 'newGroupCreated',
    connect: 'connect',
    disconnect: 'disconnect',
    error: {
        addHero: 'error.addHero',
        authenticate: 'error.authenticate',
        removeHero: 'error.removeHero',
        groupInviteSend: 'error.groupInviteSend',
        groupInviteAccept: 'error.groupInviteAccept',
        groupInviteDecline: 'error.groupInviteDecline',
        groupInviteCancel: 'error.groupInviteCancel',
        groupLeave: 'error.groupLeave'
    }
};

module.exports = clientEvents;