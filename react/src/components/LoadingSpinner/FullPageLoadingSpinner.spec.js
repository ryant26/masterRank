import React from 'react';
import FullPageLoadingSpinner from './FullPageLoadingSpinner';
import LoadingSpinner from './LoadingSpinner';
import {pushBlockingEvent} from "../../actionCreators/loading";
import {createStore} from "../../model/store";
import {mount} from 'enzyme';

describe('FullPageLoadingSpinner Component', () => {
    let store;
    let wrapper;

    beforeEach(() => {
        store = createStore();
        wrapper = mount(
            <FullPageLoadingSpinner store={store}/>
        );
    });

    it('Should not show the spinner when blockUI is falsy', () => {
        expect(wrapper.find(LoadingSpinner).length).toBeFalsy();
    });

    it('Should show the spinner when blockUI is truthy', () => {
        store.dispatch(pushBlockingEvent());
        wrapper = mount(
            <FullPageLoadingSpinner store={store}/>
        );
        expect(wrapper.find(LoadingSpinner).length).toBeTruthy();
    });

});