import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import GroupStatsContainer from './GroupStatsContainer';
import HeroImages from './HeroImages/HeroImages';
import Model from '../../model/model';

import groups from '../../resources/groupInvites';

const shallowGroupStatsContainer = (group, leader, toggleModal) => {
    return shallow(
        <GroupStatsContainer group={group} isLeading={leader} toggleModal={toggleModal}/>
    );
};

describe('GroupStatsContainer Component', () => {
    let wrapper;
    let group;

    beforeEach(() => {
        group = groups[0];
        wrapper = shallowGroupStatsContainer(group, false);
    });

    it('should render without exploding', () => {
        expect(wrapper.find(GroupStatsContainer)).toBeTruthy();
    });

    it('should match the snapshot', () => {
        let component = renderer.create(
            <GroupStatsContainer group={group} isLeading={false}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    
    it('should have the title your group if you are leading', () => {
        wrapper = shallowGroupStatsContainer(group, true);
        expect(wrapper.find('.title > h3').first().text().trim()).toEqual('Your');
    });

    it('should not show leave button if you are leading', () => {
        wrapper = shallowGroupStatsContainer(group, true);
        expect(wrapper.find('.button-six').length).toBeFalsy();
    });

    it('should show leave button if you are not leading', () => {
        expect(wrapper.find('.button-six').length).toBeTruthy();
    });

    it("should show the leader's hero images first", () => {
        expect(wrapper.find(HeroImages).props().heroNames[0]).toEqual(group.leader.heroName);
    });

    it('should calculate group SR correctly', () => {
       expect(wrapper.find('span.sub-title > b').first().text()).toEqual('2700');
    });

    it('should render group SR as a whole number', () => {
       group.leader.skillRating = 3201.99999;
       wrapper = shallowGroupStatsContainer(group, false);
       expect(wrapper.find('span.sub-title > b').first().text()).toEqual('2700');
    });

    describe('when button-six is clicked', () => {
        let toggleModal;

        beforeEach(() => {
            Model.leaveGroup = jest.fn();
            Model.createNewGroup = jest.fn();
            toggleModal = jest.fn();
            wrapper = shallowGroupStatsContainer(group, false, toggleModal);

            expect(Model.leaveGroup).not.toHaveBeenCalled();
            expect(Model.createNewGroup).not.toHaveBeenCalled();
            expect(toggleModal).not.toHaveBeenCalled();
            wrapper.find('.button-six').simulate('click');
        });

        it('should call Model.leaveGroup', () => {
            expect(Model.leaveGroup).toHaveBeenCalledWith(group.groupId);
        });

        it('should call Model.createNewGroup', () => {
            expect(Model.createNewGroup).toHaveBeenCalledWith(group.leader.heroName);
        });

        it('should call toggleModal', () => {
            expect(toggleModal).toHaveBeenCalled();
        });
    });
});