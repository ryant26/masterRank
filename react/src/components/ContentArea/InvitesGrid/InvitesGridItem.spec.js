import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import InvitesGridItem from './InvitesGridItem';
import Model from '../../../model/model';
import groupInvites from '../../../resources/groupInvites';


const mockStore = configureStore();
const getHeroCardComponent = (group) => {
    let store = mockStore({
        group: group,
    });

    return shallow(
        <InvitesGridItem invite={group} store={store}/>
    );
};

describe('InvitesGridItem Component', () => {
    const group = groupInvites[0];

    it('should match the snapshot', () => {
        let store = mockStore({
            group: group,
        });
        const component = renderer.create(
            <Provider  store={store}>
                <InvitesGridItem invite={group}/>
            </Provider>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render without exploding', () => {
        const wrapper = getHeroCardComponent(group);
        const InvitesGridComponent = wrapper.find(InvitesGridItem);
        expect(InvitesGridComponent).toBeTruthy();
    });

    it('should show the correct group SR', () => {
        const wrapper = getHeroCardComponent(group);
        expect(wrapper.find('.groupSR').text()).toEqual('2700 Group SR');
    });

    it('should show SR without the comma when < 1000', () => {
        const groupInvite = {
            groupId: 10,
            groupSize: 2,
            inviteDate: new Date(),
            leader: {
                platformDisplayName: "luckbomb#1234",
                skillRating: 900,
                heroName: "genji",
                stats: {}
            },
            members: [],
            pending: []
        };

        const wrapper = getHeroCardComponent(groupInvite);
        expect(wrapper.find('.groupSR').text()).toEqual('900 Group SR');
    });

    describe('when accept button is clicked', () => {
        let HeroCardComponent;

        beforeEach(() => {
            Model.leaveGroup = jest.fn();
            Model.acceptInvite = jest.fn();
            HeroCardComponent = getHeroCardComponent(group);
            HeroCardComponent.find('.button-secondary').simulate('click');
        });

        it('should call Model.leaveGroup with group id', () => {
            expect(Model.leaveGroup).toHaveBeenCalledWith(group.groupId);
        });

        it('should call Model.acceptInvite with group id', () => {
            expect(Model.acceptInvite).toHaveBeenCalledWith(group.groupId);
        });
    });

    it('should call Model.declineInvite when decline button is clicked', () => {
        Model.declineInvite = jest.fn();
        const wrapper = getHeroCardComponent(group);
        wrapper.find('.button-six').simulate('click');
        expect(Model.declineInvite).toHaveBeenCalledWith(group.groupId);
    });
});