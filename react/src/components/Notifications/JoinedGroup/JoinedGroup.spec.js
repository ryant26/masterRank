import React from 'react';
import { shallow } from 'enzyme';

import JoinedGroup from './JoinedGroup';
import groupInvites from '../../../resources/groupInvites';

const shallowJoinedGroup = (displayName) => {
    return shallow(
        <JoinedGroup displayName={displayName}/>
    );
};

describe('JoinGroup', () => {
    let JoinedGroupComponent;
    const displayName = groupInvites[0].leader.platformDisplayName;
    const leaderName = displayName.replace(/#.*/,"");
    //TODO only battletags need the #... striped, right? psn and xbox the numbers are part of the actual name?

    beforeEach(() => {
        JoinedGroupComponent = shallowJoinedGroup(displayName);
    });

    it('should render', () => {
        expect(JoinedGroupComponent).toHaveLength(1);
    });

    it(`should set title to "You've joined ${leaderName}'s group!"`, () => {
        expect(JoinedGroupComponent.find('.title').text())
            .toBe(`You've joined ${leaderName}'s group!`);
    });

    it(`should set message to "Add ${displayName} while you wait for other players to join"`, () => {
        expect(JoinedGroupComponent.find('.message').text())
            .toBe(`Add ${displayName} while you wait for other players to join`);
    });
});