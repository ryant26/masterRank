import * as GroupActionTypes from '../actiontypes/groupHeroes';

export const addGroupHero = (hero) => {
    return {
      type: GroupActionTypes.ADD_GROUP_HERO,
      hero
    };
};