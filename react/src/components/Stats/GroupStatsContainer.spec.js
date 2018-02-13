import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import groups from '../../resources/groupInvites';
import GroupStatsContainer from './GroupStatsContainer';
import Model from '../../model/model';

describe('GroupStatsContainer Component', () => {
    let wrapper;
    let group;

    beforeEach(() => {
        group = groups[0];
        wrapper = mount(
            <GroupStatsContainer group={group} isLeading={false}/>
        );
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

    it('should have all the hero images for the users heroes', () => {
        let heroImages = wrapper.find('.HeroImages').children();

        expect(heroImages.length).toEqual(group.members.length + 1);
    });

    it('should show the hero images with leader first', () => {
        let heroImages = wrapper.find('.HeroImages').children();

        expect(heroImages.length).toBeGreaterThan(0);

        expect(heroImages.first().props().heroName).toEqual(group.leader.heroName);
    });
    
    it('should have the title your group if you are leading', () => {
        wrapper = mount(
            <GroupStatsContainer group={group} isLeading={true}/>
        );

        expect(wrapper.find('.title > h3').first().text().trim()).toEqual('Your');
    });

    it('should not show leave button if you are leading', () => {
        wrapper = mount(
            <GroupStatsContainer group={group} isLeading={true}/>
        );

        expect(wrapper.find('.button-six').length).toBeFalsy();
    });

    it('should show leave button if you are not leading', () => {
        wrapper = mount(
            <GroupStatsContainer group={group} isLeading={false}/>
        );

        expect(wrapper.find('.button-six').length).toBeTruthy();
    });

    it('should calculate group SR correctly', () => {
       expect(wrapper.find('span.sub-title > b').first().text()).toEqual('2700');
    });

    it('should call Model.leaveGroup when button-six is clicked', () => {
        Model.leaveGroup = jest.fn();
        expect(Model.leaveGroup).not.toHaveBeenCalled();
        wrapper.find('.button-six').simulate('click');
        expect(Model.leaveGroup).toHaveBeenCalledWith(group.groupId);
    });
});