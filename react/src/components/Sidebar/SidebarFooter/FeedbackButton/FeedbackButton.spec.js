import React from 'react';
import { shallow } from 'enzyme';

import FeedbackButton from './FeedbackButton';
import { feedback } from 'components/Routes/links';

describe('Feedback button', () => {
    it('should redirect to login page when clicked', () => {
        window.location.assign = jest.fn();
        const wrapper = shallow(<FeedbackButton/>);
        wrapper.find('.FeedbackButton').simulate('click');
        expect(window.location.assign).toHaveBeenCalledWith(feedback);
    });
});