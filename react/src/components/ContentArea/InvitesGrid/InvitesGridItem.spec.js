import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import InvitesGridItem from './InvitesGridItem';
import Model from '../../../model/model';
import groupInvites from '../../../resources/groupInvites';


const mockStore = configureStore();
const getHeroCardComponent = (groupInvite) => {
    let store = mockStore({
        group: groupInvite,
    });

    return shallow(
        <InvitesGridItem invite={groupInvite} store={store}/>
    );
};

describe('InvitesGridItem Component', () => {
    const groupInvite = groupInvites[0];

    it('should match the snapshot', () => {
        let store = mockStore({
            group: groupInvite,
        });
        const component = renderer.create(
            <Provider  store={store}>
                <InvitesGridItem invite={groupInvite}/>
            </Provider>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render without exploding', () => {
        const wrapper = getHeroCardComponent(groupInvite);
        const InvitesGridComponent = wrapper.find(InvitesGridItem);
        expect(InvitesGridComponent).toBeTruthy();
    });

    it('should show the correct group SR', () => {
        const wrapper = getHeroCardComponent(groupInvite);
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
            //TODO: figure out how to assert that method {X} exists in Model expect(Model.{X}).toExist()
            Model.leaveGroup = jest.fn();
            Model.acceptGroupInviteAndRemoveFromStore = jest.fn();
            HeroCardComponent = getHeroCardComponent(groupInvite);
            expect(Model.leaveGroup).not.toHaveBeenCalled();
            expect(Model.acceptGroupInviteAndRemoveFromStore).not.toHaveBeenCalled();
            HeroCardComponent.find('.button-secondary').simulate('click');
        });

        it('should call Model.leaveGroup ', () => {
            expect(Model.leaveGroup).toHaveBeenCalled();
        });

        it('should call Model.acceptGroupInviteAndRemoveFromStore with group id', () => {
            expect(Model.acceptGroupInviteAndRemoveFromStore).toHaveBeenCalledWith(groupInvite);
        });
    });

    it('should call Model.declineGroupInviteAndRemoveFromStore when decline button is clicked', () => {
        Model.declineGroupInviteAndRemoveFromStore = jest.fn();
        const wrapper = getHeroCardComponent(groupInvite);
        wrapper.find('.button-six').simulate('click');
        expect(Model.declineGroupInviteAndRemoveFromStore).toHaveBeenCalledWith(groupInvite);
    });
});