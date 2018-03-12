import { combineReducers } from 'redux';
import HeroReducer from 'reducers/HeroReducer';
import PreferredHeroesReducer from 'reducers/PreferredHeroesReducer';
import GroupInvitesReducer from 'reducers/GroupInvitesReducer';
import UserReducer from 'reducers/UserReducer';
import GroupReducer from 'reducers/GroupReducer';
import HeroFiltersReducer from 'reducers/HeroFiltersReducer';
import RegionReducer from 'reducers/RegionReducer';
import LoadingReducer from 'reducers/LoadingReducer';
import AppReducer from 'reducers/AppReducer';

const appReducers =  combineReducers({
  heroes: HeroReducer,
  preferredHeroes: PreferredHeroesReducer,
  user: UserReducer,
  group: GroupReducer,
  groupInvites: GroupInvitesReducer,
  heroFilters: HeroFiltersReducer,
  region: RegionReducer,
  loading: LoadingReducer
});

export default function allReducers(state, action) {
  return appReducers(AppReducer(state, action), action);
}