import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import store from "./model/store";
import './index.css';
require('./stylesheets/main.scss');

import FireTeam from './containers/FireTeam';

render(
  <Provider store={store}>
    <FireTeam />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
