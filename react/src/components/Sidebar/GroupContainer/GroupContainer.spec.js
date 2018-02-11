import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import GroupContainer from './GroupContainer';

import group from '../../../resources/group';
import { users } from '../../../resources/users';

const mockStore = configureStore();
const getGroupContainerComponent = (group, preferredHeroes, user) => {
    let store = mockStore({});

    return shallow(
        <GroupContainer
            group={group}
            preferredHeroes={preferredHeroes}
            user={user}
            store={store}
        />
    );
};

describe('GroupContainer', () => {
    let GroupContainerComponent;
    const user = users[0];
    const preferredHeroes = [
        "tracer",
        "genji",
        "winston"
    ];

    beforeEach(() => {
        GroupContainerComponent = getGroupContainerComponent(group, preferredHeroes, user);
    });

    it('should render when component loads', () => {
        expect(GroupContainerComponent).toHaveLength(1);
    });

    xit('should render with className GroupContainer when component loads', () => {
        expect(GroupContainerComponent.hasClass('GroupContainer')).toBe(true);
    });

    xit('should create a new group when component mounts ', () => {

    });

    xit('should rerender when prop groups updates', () => {

    })
});