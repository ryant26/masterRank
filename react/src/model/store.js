import { createStore as createReduxStore } from 'redux';

import reducers from '../reducers/index';
import { loadState } from './stateManager';


export const createStore = function() {
    store = createReduxStore(reducers, loadState());

    return store;
};

let store = createStore();

export default store;