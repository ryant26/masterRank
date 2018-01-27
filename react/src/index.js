import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import registerServiceWorker from './registerServiceWorker';
import './index.css';
import App from './app/App';
import store from './model/store';
import { saveState } from "./model/stateManager";

require('./stylesheets/main.scss');

store.subscribe(() => {
    saveState(store.getState());
});

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();