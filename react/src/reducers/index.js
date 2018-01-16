import { combineReducers } from 'redux';
import HeroReducer from './HeroReducer';
import PreferredHeroesReducer from './PreferredHeroesReducer';
import GroupInvitesReducer from './GroupInvitesReducer';
import UserReducer from './UserReducer';
import GroupReducer from './GroupReducer';
import HeroFiltersReducer from './HeroFiltersReducer';

export default combineReducers({
  heroes: HeroReducer,
  preferredHeroes: PreferredHeroesReducer,
  groupInvites: GroupInvitesReducer,
  user: UserReducer,
  groupHeroes: GroupReducer,
  heroFilters: HeroFiltersReducer
})