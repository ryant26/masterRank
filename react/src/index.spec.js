import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { FireTeam } from './containers/FireTeam';
import HeroReducer from './reducers/HeroReducer';
import PreferredHeroesReducer from './reducers/PreferredHeroesReducer';
import GroupInvitesReducer from './reducers/GroupInvitesReducer';
import GroupReducer from './reducers/GroupReducer';

describe('index', () => {
    it('renders without crashing', () => {
        const store = createStore(combineReducers({
            heroes: HeroReducer,
            preferredHeroes: PreferredHeroesReducer,
            groupInvites: GroupInvitesReducer,
            groupHeroes: GroupReducer
        }));
        const div = document.createElement('div');
        ReactDOM.render(<Provider store={store}>
            <FireTeam />
        </Provider>, div);

        ReactDOM.unmountComponentAtNode(div);
    });
});
