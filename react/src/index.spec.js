import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { FireTeam } from './containers/FireTeam.js';
import HeroReducer from './reducers/HeroReducer.js';

it('renders without crashing', () => {
  const store = createStore(
    HeroReducer
  );
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}>
                  <FireTeam />
                  </Provider>, div);
});
