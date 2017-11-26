import * as GroupActionTypes from '../actiontypes/groupHeroes';

export const addGroupHero = (groupHero) => {
    return {
      type: GroupActionTypes.ADD_GROUP_HERO,
      groupHero
    };
};