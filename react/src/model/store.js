import { createStore as createReduxStore } from 'redux';

import reducers from '../reducers/index';
import { StateLoader } from './StateLoader';


export const createStore = function() {
    let stateLoader = new StateLoader();
    store = createReduxStore(reducers, stateLoader.loadState());

    return store;
};

let store = createStore();


export default store;