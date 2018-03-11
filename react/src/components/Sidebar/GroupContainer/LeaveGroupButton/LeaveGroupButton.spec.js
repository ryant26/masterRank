import React from 'react';
import { shallow } from 'enzyme';

import LeaveGroupButton from './LeaveGroupButton';
import Model from 'model/model';
jest.mock('model/model');

const shallowLeaveGroupButton = () => {
    return shallow(
        <LeaveGroupButton/>
    );
};

describe('LeaveGroupButton', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowLeaveGroupButton();
    });

    it('should render when mounted', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('should have className LeaveGroupButton', () => {
        expect(wrapper.find('.LeaveGroupButton')).toHaveLength(1);
    });

    it('should have text "LEAVE GROUP"', () => {
        expect(wrapper.find('.LeaveGroupButton').text()).toBe("LEAVE GROUP");
    });

    describe('when clicked', () => {

        beforeEach(() => {
            wrapper.find('.LeaveGroupButton').simulate('click');
        });

        it('should call when model.leaveGroup', () => {
            expect(Model.leaveGroup).toHaveBeenCalled();
        });

        it('should call when model.leaveGroup', () => {
            expect(Model.createNewGroup).toHaveBeenCalled();
        });
    });

});