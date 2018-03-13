import { combineReducers } from 'redux';

import restStateOnLogout from './HigherOrderReducers/restStateOnLogout';

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
  heroes: restStateOnLogout(HeroReducer),
  preferredHeroes: restStateOnLogout(PreferredHeroesReducer),
  user: restStateOnLogout(UserReducer),
  group: restStateOnLogout(GroupReducer),
  groupInvites: restStateOnLogout(GroupInvitesReducer),
  heroFilters: restStateOnLogout(HeroFiltersReducer),
  region: restStateOnLogout(RegionReducer),
  loading: restStateOnLogout(LoadingReducer),
  walkthrough: WalkthroughReducer
});

export default appReducers;