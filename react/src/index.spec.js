import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import App from 'app/App';
import token from 'resources/token';
import {MemoryRouter} from 'react-router-dom';

const mockStore = configureStore();
jest.mock('./model/store', () => jest.fn());

describe('index', () => {
    beforeEach(() => {
        global.localStorage = {accessToken: token};
    });

    afterEach(() => {
        delete global.localStorage;
    });

    it('renders without crashing', () => {
        let store = mockStore({});
        const div = document.createElement('div');
        ReactDOM.render(
            <Provider store={store}>
                <MemoryRouter>
                    <App />
                </MemoryRouter>
            </Provider>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
