import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import {getHeroes} from '../../../resources/heroes';
import HeroStatsListItem from './HeroStatsListItem';
import RecordStat from './RecordStat';
import HeroStat from './HeroStat';

describe('HeroStatsListItem component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(
            <HeroStatsListItem hero={getHeroes()[0]}/>
        );
    });

    it('should render without exploding', () => {
        expect(wrapper.find(HeroStatsListItem)).toBeTruthy();
    });

    it('should match the snapshot', () => {
        let component = renderer.create(
            <HeroStatsListItem hero={getHeroes()[0]}/>
        );

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should have 3 record stats', () => {
        let recordStats = wrapper.find(RecordStat);

        expect(recordStats.length).toEqual(3);
        expect(recordStats.map((stat) => stat.props().statName)).toEqual(['wins', 'losses', 'k/d']);
    });

    it('should have 6 hero stats', () => {
        let recordStats = wrapper.find(HeroStat);

        expect(recordStats.length).toEqual(6);
        expect(recordStats.map((stat) => stat.props().statName)).toEqual(['damage', 'healing', 'blocked', 'obj. kills', 'obj. time', 'accuracy']);
    });

    it('should show the leader icon when leader is set', () => {
        wrapper = mount(
            <HeroStatsListItem hero={getHeroes()[0]} isLeader={true}/>
        );

        expect(wrapper.find('.crown').length).toEqual(1);
    });

    it('should not show the leader icon when leader is cleared', () => {
        wrapper = mount(
            <HeroStatsListItem hero={getHeroes()[0]} isLeader={false}/>
        );

        expect(wrapper.find('.crown').length).toEqual(0);
    });

    it('should show the platformDisplayName when prop is set', () => {
        wrapper = mount(
            <HeroStatsListItem hero={getHeroes()[0]} showPlatformDisplayName={true}/>
        );

        expect(wrapper.find('h3').text()).toEqual('PwNShoPP#1662 - Soldier76');
    });

    it('should not show the platformDisplayName when prop is cleared', () => {
        wrapper = mount(
            <HeroStatsListItem hero={getHeroes()[0]} isLeader={false}/>
        );

        expect(wrapper.find('h3').text()).toEqual('Soldier76');
    });
});