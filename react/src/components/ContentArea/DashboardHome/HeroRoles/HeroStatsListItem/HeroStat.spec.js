import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import HeroStat from './HeroStat';

describe('HeroStat Component', () => {
    let wrapper;
    const stat = 10;
    const percentile = 0.9;
    const statLabel = '/min';
    const statName = 'Statistic';

    beforeEach(() => {
        wrapper = mount(
            <HeroStat stat={stat} percentile={percentile} statLabel={statLabel} statName={statName}/>
        );
    });

    it('should render without exploding', () => {
        expect(wrapper.find(HeroStat)).toBeTruthy();
    });

    it('should match the snapshot', () => {
        let component = renderer.create(
            <HeroStat stat={stat} statLabel={statLabel} statName={statName} percentile={percentile}/>
        );

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should truncate stats with many decimal points', () => {
        wrapper = mount(
            <HeroStat stat={1.12345678} percentile={percentile} statLabel={statLabel} statName={statName}/>
        );

        expect(wrapper.find('.stat').text()).toEqual('1');
    });

    it('should show a dash for undefined stats', () => {
        wrapper = mount(
            <HeroStat percentile={percentile} statLabel={statLabel} statName={statName}/>
        );

        expect(wrapper.find('.stat').text()).toEqual('-');
    });

    it('should translate the stat name to uppercase', () => {
        wrapper = mount(
            <HeroStat stat={stat} percentile={percentile} statLabel={statLabel} statName={'mystat'}/>
        );

        expect(wrapper.find('.sub-title').last().text()).toEqual('MYSTAT');
    });
});