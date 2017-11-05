import React from 'react';
import { mount } from 'enzyme';
import StatBox from './StatBox';

describe('StatBox Component',()=> {

    it('should render without exploding', () => {
        const props = Object.assign({
            percentile: '20%',        
            value: '130',
            label: 'Healing' 
        });

        const wrapper = mount(
            <StatBox {...props}/>
        );

        const StatBoxComponent = wrapper.find(StatBox);
        expect(StatBoxComponent.length).toBeTruthy();        
    });
});