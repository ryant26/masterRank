import React from 'react';
import { createStore, combineReducers } from 'redux';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
require('./stylesheets/main.scss');

import HeroReducer from './reducers/HeroReducer';
import PreferredHeroesReducer from './reducers/PreferredHeroesReducer';
import GroupInvitesReducer from './reducers/GroupInvitesReducer';

import FireTeam from './containers/FireTeam';

const store = createStore(combineReducers({
  heroes: HeroReducer,
  preferredHeroes: PreferredHeroesReducer,
  groupInvites: GroupInvitesReducer
}));

render(
  <Provider store={store}>
    <FireTeam />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
