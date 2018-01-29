import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/App';
import Store from './model/store';
import token from './resources/token';
import {MemoryRouter} from 'react-router-dom';

describe('index', () => {
    beforeEach(() => {
        global.localStorage = {accessToken: token};
    });

    afterEach(() => {
        delete global.localStorage;
    });

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <Provider store={Store}>
                <MemoryRouter>
                    <App />
                </MemoryRouter>
            </Provider>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
