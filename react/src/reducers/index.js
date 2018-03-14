import { combineReducers } from 'redux';

import resetStateOnLogout from './HigherOrderReducers/resetStateOnLogout';

import HeroReducer from './HeroReducer';
import PreferredHeroesReducer from './PreferredHeroesReducer';
import GroupInvitesReducer from './GroupInvitesReducer';
import UserReducer from './UserReducer';
import GroupReducer from './GroupReducer';
import HeroFiltersReducer from './HeroFiltersReducer';
import RegionReducer from './RegionReducer';
import LoadingReducer from './LoadingReducer';
import WalkthroughReducer from './walkthrough/WalkthroughReducer';

const appReducers =  combineReducers({
  heroes: resetStateOnLogout(HeroReducer),
  preferredHeroes: resetStateOnLogout(PreferredHeroesReducer),
  user: resetStateOnLogout(UserReducer),
  group: resetStateOnLogout(GroupReducer),
  groupInvites: resetStateOnLogout(GroupInvitesReducer),
  heroFilters: resetStateOnLogout(HeroFiltersReducer),
  region: resetStateOnLogout(RegionReducer),
  loading: resetStateOnLogout(LoadingReducer),
  walkthrough: WalkthroughReducer
});

export default appReducers;