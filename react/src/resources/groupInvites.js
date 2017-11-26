const groupInvites = [
  {
    groupId: 10,
    groupSize: 4,
    inviteDate: new Date(),
    leader: {
      battleNetId: "luckbomb#1234",
      hero: {
        name: "genji",
        stats: {}
      }
    },
    members: [
      {
        battleNetId: "wismo0#1234",
        leader: true,
        hero: {
          name: "widowMaker",
          stats: {}
        }
      }
    ],
    pending: [
      {
        battleNetId: "andyLin#1234",
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
      battleNetId: "luckbomb#1234",
        hero: {
        name: "genji",
          stats: {}
      }
    },
    members: [],
    pending: [
      {
        battleNetId: "andyLin#1234",
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
      battleNetId: "luckbomb#1234",
      hero: {
        name: "doomfist",
        stats: {}
      }
    },
    members: [
      {
        battleNetId: "wismo0#1234",
        leader: true,
        hero: {
          name: "soldier76",
          stats: {}
        }
      }
    ],
    pending: [
      {
        battleNetId: "andyLin#1234",
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