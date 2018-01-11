const groupInvites = [
  {
    groupId: 10,
    groupSize: 4,
    inviteDate: new Date(),
    leader: {
      platformDisplayName: "luckbomb#1234",
      hero: {
        name: "genji",
        stats: {}
      }
    },
    members: [
      {
        platformDisplayName: "wismo0#1234",
        leader: true,
        hero: {
          name: "widowMaker",
          stats: {}
        }
      }
    ],
    pending: [
      {
        platformDisplayName: "andyLin#1234",
        leader: true,
        hero: {
          name: "trancer",
          stats: {}
        }
      }
    ]
  },
  {
    groupId: 8,
    groupSize: 3,
    inviteDate: new Date(),
    leader: {
      platformDisplayName: "luckbomb#1234",
        hero: {
        name: "genji",
          stats: {}
      }
    },
    members: [],
    pending: [
      {
        platformDisplayName: "andyLin#1234",
        leader: true,
        hero: {
          name: "trancer",
          stats: {}
        }
      }
    ]
  },
  {
    groupId: 2,
    groupSize: 4,
    inviteDate: new Date(),
    leader: {
      platformDisplayName: "luckbomb#1234",
      hero: {
        name: "doomfist",
        stats: {}
      }
    },
    members: [
      {
        platformDisplayName: "wismo0#1234",
        leader: true,
        hero: {
          name: "soldier76",
          stats: {}
        }
      }
    ],
    pending: [
      {
        platformDisplayName: "andyLin#1234",
        leader: true,
        hero: {
          name: "winston",
          stats: {}
        }
      }
    ]
  }
];

export default groupInvites;