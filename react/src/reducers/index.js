import { combineReducers } from 'redux';
import HeroReducer from './HeroReducer';
import PreferredHeroesReducer from './PreferredHeroesReducer';
import GroupInvitesReducer from './GroupInvitesReducer';
import UserReducer from './UserReducer';
import GroupReducer from './GroupReducer';
import HeroFiltersReducer from './HeroFiltersReducer';
import RegionReducer from './RegionReducer';
import LoadingReducer from './LoadingReducer';

export default combineReducers({
  heroes: HeroReducer,
  preferredHeroes: PreferredHeroesReducer,
  user: UserReducer,
  group: GroupReducer,
  groupInvites: GroupInvitesReducer,
  heroFilters: HeroFiltersReducer,
  region: RegionReducer,
  loading: LoadingReducer
});