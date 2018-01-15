import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';
import store from "./model/store";
import './index.css';

require('./stylesheets/main.scss');

import Dashboard from './containers/Dashboard';
import LoginPage from './containers/LoginPage';

render(
  <Provider store={store}>
    <Router>
        <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/" component={Dashboard} />
        </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();