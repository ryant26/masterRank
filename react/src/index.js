import React from 'react';
import { createStore } from 'redux';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import HeroReducer from './reducers/HeroReducer.js';
import MasterRank from './containers/MasterRank.js';

const store = createStore(
  HeroReducer
);

render(
  <Provider store={store}>
    <MasterRank />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
