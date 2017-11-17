import React from 'react';
import { createStore } from 'redux';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
require('./stylesheets/main.scss');

import HeroReducer from './reducers/HeroReducer';
import FireTeam from './containers/FireTeam';

const store = createStore(
  HeroReducer
);

render(
  <Provider store={store}>
    <FireTeam />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
