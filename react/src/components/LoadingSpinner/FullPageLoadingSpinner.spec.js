import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import FullPageLoadingSpinner from 'components/LoadingSpinner/FullPageLoadingSpinner';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

const mockStore = configureStore();

const shallowFullPageLoadingSpinner = (blockUI) => {
    const store = mockStore({
        loading: {
            blockUI: blockUI
        }
    });

    return shallow(
        <FullPageLoadingSpinner store={store}/>
    );
};

describe('FullPageLoadingSpinner Component', () => {
    let wrapper;
    let component;

    it('Should not show the spinner when blockUI value is less than 1', () => {
        wrapper = shallowFullPageLoadingSpinner(0);
        component = wrapper.dive();
        expect(component.find(LoadingSpinner)).toHaveLength(0);
    });

    it('Should show the spinner when blockUI value is greater than or equal to 1', () => {
        wrapper = shallowFullPageLoadingSpinner(1);
        component = wrapper.dive();
        expect(component.find(LoadingSpinner)).toHaveLength(1);
    });
});