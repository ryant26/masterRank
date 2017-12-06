import { createStore as createReduxStore, combineReducers } from 'redux';
import HeroReducer from '../reducers/HeroReducer';
import PreferredHeroesReducer from '../reducers/PreferredHeroesReducer';
import GroupInvitesReducer from '../reducers/GroupInvitesReducer';


const createStore = function() {
    store = createReduxStore(combineReducers({
        heroes: HeroReducer,
        preferredHeroes: PreferredHeroesReducer,
        groupInvites: GroupInvitesReducer
    }));

    return store;
};

let store = createStore();


export default store;