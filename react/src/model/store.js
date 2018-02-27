import { createStore as createReduxStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers/index';
import { loadState } from './reduxSerializer';


export const createStore = function() {
    store = createReduxStore(reducers, loadState(), applyMiddleware(thunk));

    return store;
};

let store = createStore();

export default store;