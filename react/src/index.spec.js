import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './app/App';
import Store from './model/store';

describe('index', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Provider store={Store}>
            <App />
        </Provider>, div);

        ReactDOM.unmountComponentAtNode(div);
    });
});
