import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux'

import registerServiceWorker from './registerServiceWorker';
import './index.css';
import App from './app/App';
import store from './model/store'
import { StateLoader } from "./StateLoader"

require('./stylesheets/main.scss');

let stateLoader = new StateLoader();

store.subscribe(() => {
    stateLoader.saveState(store.getState());
});

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();