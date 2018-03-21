import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import FeedbackButton from 'components/Sidebar/SidebarFooter/FeedbackButton/FeedbackButton';
import { feedback } from 'components/Routes/links';
import { clickFeedbackTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';
jest.mock('actionCreators/googleAnalytic/googleAnalytic');

import { mockLocation } from 'utilities/test/mockingUtilities';

const mockStore = configureStore();
const shallowFeedbackButton = () => {
    let store = mockStore({});
    store.dispatch = jest.fn();
    return shallow(
        <FeedbackButton store={store}/>
    ).dive();
};



describe('Feedback button', () => {
    let wrapper;

    beforeEach(() => {
        mockLocation();
        wrapper = shallowFeedbackButton();
    });

    describe('when clicked', () => {
        beforeEach(() => {
            wrapper.find('.FeedbackButton').simulate('click');
        });

        it('should dispatch clickFeedbackTrackingEvent', () => {
            expect(clickFeedbackTrackingEvent).toHaveBeenCalled();
        });

        it('should redirect to login page', () => {
            expect(window.location.assign).toHaveBeenCalledWith(feedback);
        });
    });
});