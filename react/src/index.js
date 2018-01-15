import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import registerServiceWorker from './registerServiceWorker';
import store from "./model/store";
import './index.css';

import App from './app/App';

require('./stylesheets/main.scss');

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();