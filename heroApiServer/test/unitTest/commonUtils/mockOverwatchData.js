const battleNetId = 'PwNShoPP#1662';
const region = 'us';
const platform = 'pc';

module.exports = {
    playerDetails: {
        level: 188,
        portrait: 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x025000000000115A.png',
        displayName: battleNetId,
        platform,
        region
    },

    playerDetailsNoLevel: {
        portrait: 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x025000000000115A.png',
        displayName: battleNetId,
        platform,
        region
    },

    emptyPlayerStats: {
        stats: {
            competitiveRank: NaN
        }
    },

    token: {
        battleNetId,
        platform,
        region
    },

    playerStats: {
        name: 'PwNShoPP-1662',
        region: 'us',
        platform: 'pc',
        stats: {
            competitiveRank: 2500,
            competitive: {
                all: {
                    name: 'all',
                    combat: {
                        melee_final_blows: 18,
                        solo_kills: 73,
                        objective_kills: 784,
                        final_blows: 499,
                        eliminations: 1434,
                        all_damage_done: 585980,
                        environmental_kills: 4,
                        multikills: 14,
                        objective_time: '02:18:56',
                        deaths: 340
                    },
                    assists: {
                        healing_done: 37492
                    },
                    best: {
                        eliminations_most_in_game: 87,
                        final_blows_most_in_game: 34,
                        all_damage_done_most_in_game: 32532,
                        healing_done_most_in_game: 12469,
                        defensive_assists_most_in_game: 18,
                        offensive_assists_most_in_game: 4,
                        objective_kills_most_in_game: 51,
                        objective_time_most_in_game: '08:18',
                        multikill_best: 4,
                        solo_kills_most_in_game: 34,
                        time_spent_on_fire_most_in_game: '08:24'
                    },
                    average: {
                        all_damage_done_avg_per_10_min: 16
                    },
                    awards: {
                        cards: 22,
                        medals: 129,
                        medals_gold: 66,
                        medals_silver: 25,
                        medals_bronze: 38
                    },
                    game: {
                        time_played: 10,
                        time_spent_on_fire: '01:01:52',
                        games_played: 43,
                        games_won: 27,
                        games_lost: 14
                    }
                },
                soldier76: {
                    name: 'soldier76',
                    hero: {
                        helix_rockets_kills_most_in_game: 9,
                        helix_rockets_kills: 42,
                        tactical_visor_kills: 41,
                        tactical_visor_kills_most_in_game: 11,
                        biotic_fields_deployed: 82,
                        biotic_field_healing_done: 8661,
                        melee_final_blow_most_in_game: 1
                    },
                    combat: {
                        eliminations: 154,
                        final_blows: 75,
                        solo_kills: 6,
                        all_damage_done: 88660,
                        objective_kills: 85,
                        multikill: 1,
                        melee_final_blow: 1,
                        critical_hits: 186,
                        critical_hit_accuracy: 4,
                        deaths: 50,
                        weapon_accuracy: 41,
                        objective_time: '06:33'
                    },
                    assists: {
                        turrets_destroyed: 6,
                        self_healing: 5696
                    },
                    best: {
                        eliminations_most_in_life: 9,
                        all_damage_done_most_in_life: 5820,
                        weapon_accuracy_best_in_game: 54,
                        kill_streak_best: 9,
                        all_damage_done_most_in_game: 17828,
                        eliminations_most_in_game: 34,
                        final_blows_most_in_game: 20,
                        objective_kills_most_in_game: 20,
                        objective_time_most_in_game: '01:53',
                        solo_kills_most_in_game: 3,
                        critical_hits_most_in_game: 40,
                        critical_hits_most_in_life: 10,
                        self_healing_most_in_game: 974
                    },
                    average: {
                        all_damage_done_avg_per_10_min: 19.18
                    },
                    deaths: {
                        deaths: 65
                    },
                    awards: {
                        medals_bronze: 5,
                        medals_silver: 4,
                        medals_gold: 4,
                        medals: 13
                    },
                    game: {
                        time_played: 1,
                        games_played: 5,
                        games_won: 1,
                        games_lost: 1,
                        time_spent_on_fire: '01:35',
                        win_percentage: 26
                    }
                }
            }
        }
    },

    mockPlayer: {
        name: 'testPlayer#1234',
        region: 'us',
        platform: 'pc',
        stats: {
            competitiveRank: 2500,
            competitive: {
                soldier76: {
                    name: 'soldier76',
                    hero: {
                        damage_blocked: 180
                    },
                    combat: {
                        all_damage_done: 180,
                        objective_kills: 3,
                        eliminations: 3,
                        deaths: 1,
                        weapon_accuracy: 3,
                        objective_time: '00:00:03',
                    },
                    game: {
                        time_played: 1,
                        games_played: 1,
                        games_won: 3,
                        games_lost: 3
                    },
                    assists: {
                        healing_done: 180
                    }
                }
            }
        }
    },

    mockPlayerMissingHeroAttributes: {
        name: 'testPlayer#1234',
        region: 'us',
        platform: 'pc',
        stats: {
            competitive: {
                soldier76: {
                    name: 'soldier76',
                }
            }
        }
    },


    playerNoStatsObj: {
        name: 'doesntMAtter',
        region: 'us',
        platform: 'pc'
    }
};