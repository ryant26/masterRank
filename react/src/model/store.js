import { createStore as createReduxStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import GoogleAnalytic from '../middleware/GoogleAnalytic';
import GoogleAnalyticTracker from './trackers/GoogleAnalyticTracker';

import reducers from '../reducers/index';
import { loadState } from './reduxSerializer';

export const createStore = function() {
    const tracker = new GoogleAnalyticTracker(gtag); // eslint-disable-line

    store = createReduxStore(
        reducers,
        loadState(),
        applyMiddleware(
            thunk,
            GoogleAnalytic(tracker)
        ));

    return store;
};

let store = createStore();

export default store;