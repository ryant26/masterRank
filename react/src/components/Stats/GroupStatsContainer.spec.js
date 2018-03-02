import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

import GroupStatsContainer from './GroupStatsContainer';
import HeroStatsList from './HeroStatsList/HeroStatsList';
import HeroImages from './HeroImages/HeroImages';
import Model from '../../model/model';

import { users } from '../../resources/users';
import groups from '../../resources/groupInvites';

const mockStore = configureStore();

const shallowGroupStatsContainer = (group, leader) => {
    return shallow(
        <GroupStatsContainer group={group} isLeading={leader}/>
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
        let store = mockStore({
            user: users[0]
        });
        let component = renderer.create(
            <Provider store={store}>
                <GroupStatsContainer store={store} group={group} isLeading={false}/>
            </Provider>
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

    it('should calculate group SR correctly', () => {
       expect(wrapper.find('span.sub-title > b').first().text()).toEqual('2700');
    });

    it('should render group SR as a whole number', () => {
       group.leader.skillRating = 3201.99999;
       wrapper = shallowGroupStatsContainer(group, false);
       expect(wrapper.find('span.sub-title > b').first().text()).toEqual('2700');
    });

    describe('should mount HeroStatsList for all group', () => {
        it('members and leader in order', () => {
            let heroes = [group.leader, ...group.members];
            const HeroStatsListHeroesProp = wrapper.find(HeroStatsList).at(0).props().heroes;
            expect(HeroStatsListHeroesProp).toEqual(heroes);
            expect(HeroStatsListHeroesProp[0]).toEqual(group.leader);
            expect(HeroStatsListHeroesProp[1]).toEqual(group.members[0]);
        });

        it('members and leader isPending prop should be false', () => {
            expect(wrapper.find(HeroStatsList).at(0).props().isPending).toBeFalsy();
        });

        it('pending members in order', () => {
            const HeroStatsListHeroesProp = wrapper.find(HeroStatsList).at(1).props().heroes;
            expect(HeroStatsListHeroesProp).toEqual(group.pending);
            expect(HeroStatsListHeroesProp[0]).toEqual(group.pending[0]);
        });

        it('pending members isPending prop should be true', () => {
            expect(wrapper.find(HeroStatsList).at(1).props().isPending).toBeTruthy();
        });
    });

    describe('should mount HeroImages for all group', () => {
        it('members and leader in order', () => {
            let heroNames = [group.leader.heroName, ...group.members.map((hero) => hero.heroName)];
            const heroImagesHeroNamesProp = wrapper.find(HeroImages).at(0).props().heroNames;
            expect(heroImagesHeroNamesProp).toEqual(heroNames);
            expect(heroImagesHeroNamesProp[0]).toEqual(group.leader.heroName);
            expect(heroImagesHeroNamesProp[1]).toEqual(group.members[0].heroName);
        });

        it('members and leader isPending prop should be false', () => {
            expect(wrapper.find(HeroImages).at(0).props().isPending).toBeFalsy();
        });

        it('pending members in order', () => {
            let heroNames = group.pending.map((hero) => hero.heroName);
            const heroImagesHeroNamesProp = wrapper.find(HeroImages).at(1).props().heroNames;
            expect(heroImagesHeroNamesProp).toEqual(heroNames);
            expect(heroImagesHeroNamesProp[0]).toEqual(group.pending[0].heroName);
        });

        it('pending members isPending prop should be true', () => {
            expect(wrapper.find(HeroImages).at(1).props().isPending).toBeTruthy();
        });
    });

    it('should show correct number of members in the group plus leader', () => {
        expect(wrapper.find('.players-joined > b').text()).toEqual(`${group.members.length + 1}`);
    });

    it('should show correct number of invites pending', () => {
        expect(wrapper.find('.invites-pending > b').text()).toEqual(`${group.pending.length}`);
    });

    describe('when button-six is clicked', () => {
        beforeEach(() => {
            Model.leaveGroup = jest.fn();
            Model.createNewGroup = jest.fn();
            wrapper = shallowGroupStatsContainer(group, false);

            expect(Model.leaveGroup).not.toHaveBeenCalled();
            expect(Model.createNewGroup).not.toHaveBeenCalled();
            wrapper.find('.button-six').simulate('click');
        });

        it('should call Model.leaveGroup', () => {
            expect(Model.leaveGroup).toHaveBeenCalled();
        });

        it('should call Model.createNewGroup', () => {
            expect(Model.createNewGroup).toHaveBeenCalled();
        });
    });
});