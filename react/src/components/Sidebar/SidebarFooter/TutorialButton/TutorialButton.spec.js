import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import { generateMockUser } from 'utilities/test/mockingUtilities';
import { startWalkthrough } from 'actionCreators/walkthrough/walkthrough';
jest.mock('actionCreators/walkthrough/walkthrough');
import { clickTutorialTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';
jest.mock('actionCreators/googleAnalytic/googleAnalytic');

import TutorialButton from 'components/Sidebar/SidebarFooter/TutorialButton/TutorialButton';

const mockStore = configureStore();

const getTutorialButton = (user) => {
    let store = mockStore({
        user
    });
    store.dispatch = jest.fn();

    return shallow(
        <TutorialButton store={store}/>
    ).dive();
};

describe('TutorialButton', () => {
    const user = generateMockUser();
    let wrapper;

    beforeEach(() => {
        wrapper = getTutorialButton(user);
    });

    it('should render', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('should render class TutorialButton with text "Tutorial"', () => {
        expect(wrapper.find('.TutorialButton').text()).toBe("Tutorial");
    });

    describe('when clicked', () => {

        beforeEach(() => {
            expect(clickTutorialTrackingEvent).not.toHaveBeenCalled();
            expect(startWalkthrough).not.toHaveBeenCalled();
            wrapper.simulate('click');
        });

        afterEach(() => {
            clickTutorialTrackingEvent.mockClear();
            startWalkthrough.mockClear();
        });

        it('should dispatch clickTutorialTrackingEvent ', () => {
            expect(clickTutorialTrackingEvent).toHaveBeenCalled();
        });

        it('should dispatch startTutorial action', () => {
            expect(startWalkthrough).toHaveBeenCalledWith(user.platformDisplayName);
        });
    });

});