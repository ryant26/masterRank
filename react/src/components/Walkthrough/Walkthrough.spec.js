import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import JoyRide from 'react-joyride';

import { finishedWalkthrough } from '../../actionCreators/walkthrough/walkthrough';
jest.mock('../../actionCreators/walkthrough/walkthrough');

import Walkthrough from './Walkthrough';


const mockStore = configureStore();
const shallowWalkthrough = (walkthrough) => {
    let store = mockStore({
        walkthrough
    });
    return shallow(
        <Walkthrough store={store}/>
    ).dive();
};

describe('Walkthrough', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowWalkthrough('finished');
    });

    afterEach(() => {
        finishedWalkthrough.mockClear();
    });

    it('should render', () => {
        expect(wrapper).toHaveLength(1);
    });

    describe('JoyRide', () => {

        it('should render', () => {
            expect(wrapper.find(JoyRide)).toHaveLength(1);
        });

        describe('step', () => {
            //TODO: Finalize all steps and add their tests.
            describe('one', () => {
                let stepOne;

                beforeEach(() => {
                    stepOne = wrapper.find(JoyRide).props().steps[0];
                });

                it('should have a title prop equal to Preferred Heroes', () => {
                    expect(stepOne.title).toBe('Preferred Heroes');
                });

                it('should have a text prop equal to...', () => {
                    let text = 'These hero icons represent the heroes you are willing to play in-game. We\'ve selected your top 5 based on playtime. You can change them at any time by clicking on any hero icon.';
                    expect(stepOne.text).toBe(text);
                });

                it('should have a selector prop equal to .PreferredHeroes-HeroList', () => {
                    expect(stepOne.selector).toBe('.PreferredHeroes-HeroList');
                });

                it('should have a position prop equal to right', () => {
                    expect(stepOne.position).toBe('right');
                });
            });
        });

        it('should set run prop to false when runWalkthrough prop is not "run"', () => {
            expect(wrapper.find(JoyRide).props().run).toBe(false);
        });

        it('should set run prop to true when walkthrough prop is "run"', () => {
            wrapper = shallowWalkthrough('run');
            expect(wrapper.find(JoyRide).props().run).toBe(true);
        });

        it('should set auto start prop to true Walkthrough ', () => {
            expect(wrapper.find(JoyRide).props().autoStart).toBe(true);
        });

        it('should set show skip button prop to true', () => {
            expect(wrapper.find(JoyRide).props().showSkipButton).toBe(true);
        });

        it('should set type prop to continuous', () => {
            expect(wrapper.find(JoyRide).props().type).toBe('continuous');
        });

        it('should set callback prop to tourComplete', () => {
            expect(wrapper.find(JoyRide).props().callback).toBe(wrapper.instance().walkthroughCallback);
        });

        //TODO: dont know how to get the mocked dispatch into a connected component
        xit('should dispatch finishedWalkthrough when tour is finished or skipped', () => {
            wrapper.find(JoyRide).props().callback({
                type: 'finished'
            });
            expect(finishedWalkthrough).toHaveBeenCalled();
        });
    });
});
