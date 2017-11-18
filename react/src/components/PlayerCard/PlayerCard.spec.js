import React from 'react';
import { mount } from 'enzyme';
import PlayerCard from './PlayerCard';

describe('Player Card Component', () => {
    it('should render without exploding', () => {
        const wrapper = mount(
            <PlayerCard user={{
                "_id": 12,
                "platformDisplayName": "PwNShoPP#1662",
                "lastUpdated": "2017-10-15T01:43:36.459Z",
                "platform": "pc",
                "level": 155,
                "portrait": "https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x025000000000115A.png",
                "region": "us",
                "skillRating": 2450
            }}/>
        );

        const PlayerCardComponent = wrapper.find(PlayerCard);
        expect(PlayerCardComponent).toBeTruthy();
        expect(JSON.stringify(PlayerCardComponent.props().user)).toBe(
            JSON.stringify({
                "_id": 12,
                "platformDisplayName": "PwNShoPP#1662",
                "lastUpdated": "2017-10-15T01:43:36.459Z",
                "platform": "pc",
                "level": 155,
                "portrait": "https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x025000000000115A.png",
                "region": "us",
                "skillRating": 2450
            })
        );
    });
});