import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Store from './model/store';
import { Dashboard } from './containers/Dashboard';

describe('index', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Provider store={Store}>
            <Dashboard />
        </Provider>, div);

        ReactDOM.unmountComponentAtNode(div);
    });
});
