import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import {getHeroes} from '../../../resources/heroes';
import HeroStatsListItem from './HeroStatsListItem';
import RecordStat from './RecordStat';
import HeroStat from './HeroStat';

describe('HeroStatsListItem', () => {
    let wrapper;
    let hero;

    beforeEach(() => {
        hero = getHeroes()[0];
        wrapper = shallow(
            <HeroStatsListItem hero={hero}/>
        );
    });

    it('should render without exploding', () => {
        expect(wrapper.find(HeroStatsListItem)).toBeTruthy();
    });

    describe('when hero has stats', () => {

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
            wrapper = shallow(
                <HeroStatsListItem hero={hero} isLeader={true}/>
            );

            expect(wrapper.find('.crown').length).toEqual(1);
        });

        it('should not show the leader icon when leader is cleared', () => {
            wrapper = shallow(
                <HeroStatsListItem hero={hero} isLeader={false}/>
            );

            expect(wrapper.find('.crown').length).toEqual(0);
        });

        it('should show the platformDisplayName when prop is set', () => {
            wrapper = shallow(
                <HeroStatsListItem hero={hero} showPlatformDisplayName={true}/>
            );

            expect(wrapper.find('h3').text()).toEqual('PwNShoPP#1662 - Soldier76');
        });

        it('should not show the platformDisplayName when prop is cleared', () => {
            wrapper = shallow(
                <HeroStatsListItem hero={hero} isLeader={false}/>
            );

            expect(wrapper.find('h3').text()).toEqual('Soldier76');
        });
    });

    describe('when hero has no stats', () => {

        beforeEach(() => {
            hero = getHeroes()[0];
            hero.stats = null;
            wrapper = shallow(
                <HeroStatsListItem hero={hero}/>
            );
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
            wrapper = shallow(
                <HeroStatsListItem hero={hero} isLeader={true}/>
            );

            expect(wrapper.find('.crown').length).toEqual(1);
        });

        it('should not show the leader icon when leader is cleared', () => {
            wrapper = shallow(
                <HeroStatsListItem hero={hero} isLeader={false}/>
            );

            expect(wrapper.find('.crown').length).toEqual(0);
        });

        it('should show the platformDisplayName when prop is set', () => {
            wrapper = shallow(
                <HeroStatsListItem hero={hero} showPlatformDisplayName={true}/>
            );

            expect(wrapper.find('h3').text()).toEqual('PwNShoPP#1662 - Soldier76');
        });

        it('should not show the platformDisplayName when prop is cleared', () => {
            wrapper = shallow(
                <HeroStatsListItem hero={hero} isLeader={false}/>
            );

            expect(wrapper.find('h3').text()).toEqual('Soldier76');
        });
    });

    describe('snapshots should match', () => {
        it('when hero stats are defined', () => {
            let componentWithStats = renderer.create(
                <HeroStatsListItem hero={hero}/>
            );

            let tree = componentWithStats.toJSON();
            expect(tree).toMatchSnapshot();
        });

        it('when hero stats are null', () => {
            hero.stats = null;
            let componentWithoutStats = renderer.create(
                <HeroStatsListItem hero={hero}/>
            );

            let tree = componentWithoutStats.toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
});