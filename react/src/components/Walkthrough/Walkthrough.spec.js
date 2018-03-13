import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import JoyRide from 'react-joyride';

import { finishWalkthrough } from '../../actionCreators/walkthrough/walkthrough';
jest.mock('../../actionCreators/walkthrough/walkthrough');

import Walkthrough from './Walkthrough';


const mockStore = configureStore();
const shallowWalkthrough = (walkthrough, blockUI=0) => {
    let store = mockStore({
        walkthrough: {
            state: walkthrough
        },
        loading: {
            blockUI: blockUI
        },
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
        finishWalkthrough.mockClear();
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
                    let text = 'These hero icons represent the heroes you are willing to play in-game. We\'ve selected your 5 most played heroes. You can change them at any time by clicking on the hero icons.';
                    expect(stepOne.text).toBe(text);
                });

                it('should have a selector prop equal to .PreferredHeroes-HeroList', () => {
                    expect(stepOne.selector).toBe('.PreferredHeroes-HeroList');
                });

                it('should have a position prop equal to right', () => {
                    expect(stepOne.position).toBe('right');
                });
            });

            describe('two', () => {
                let stepOne;

                beforeEach(() => {
                    stepOne = wrapper.find(JoyRide).props().steps[1];
                });

                it('should have a title prop equal to Preferred Heroes', () => {
                    expect(stepOne.title).toBe('Players Currently Looking For a Group');
                });

                it('should have a text prop equal to...', () => {
                    let text = 'All players currently looking for a group will show up here.';
                    expect(stepOne.text).toBe(text);
                });

                it('should have a selector prop equal to .PreferredHeroes-HeroList', () => {
                    expect(stepOne.selector).toBe('.HeroRolesContainer');
                });

                it('should have a position prop equal to right', () => {
                    expect(stepOne.position).toBe('top');
                });
            });

            describe('three', () => {
                let stepOne;

                beforeEach(() => {
                    stepOne = wrapper.find(JoyRide).props().steps[2];
                });

                it('should have a title prop equal to Preferred Heroes', () => {
                    expect(stepOne.title).toBe('Invite Player to Your Group');
                });

                it('should have a text prop equal to...', () => {
                    let text = 'Click on the hero icon to invite player to your group.';
                    expect(stepOne.text).toBe(text);
                });

                it('should have a selector prop equal to .PreferredHeroes-HeroList', () => {
                    expect(stepOne.selector).toBe('.invitePlayerButton:nth-child(1)');
                });

                it('should have a position prop equal to right', () => {
                    expect(stepOne.position).toBe('bottom');
                });

                it('should have a allowClicksThruHole prop equal to true', () => {
                    expect(stepOne.allowClicksThruHole).toBe(true);
                });
            });

            describe('four', () => {
                let stepOne;

                beforeEach(() => {
                    stepOne = wrapper.find(JoyRide).props().steps[3];
                });

                it('should have a title prop equal to Preferred Heroes', () => {
                    expect(stepOne.title).toBe('Filter Players by Hero');
                });

                it('should have a text prop equal to...', () => {
                    let text = 'Filter the lists below by Hero. For instance, if you select mercy, only players willing to play mercy will show up';
                    expect(stepOne.text).toBe(text);
                });

                it('should have a selector prop equal to .PreferredHeroes-HeroList', () => {
                    expect(stepOne.selector).toBe('.HeroSelector');
                });

                it('should have a position prop equal to right', () => {
                    expect(stepOne.position).toBe('bottom');
                });

                it('should have a allowClicksThruHole prop equal to true', () => {
                    expect(stepOne.allowClicksThruHole).toBe(true);
                });
            });
        });

        describe('when loading blockUI not equal 0', () => {
            const blockUI = 1;

            it('and walkthrough equals "run" should set run prop to false', () => {
                wrapper = shallowWalkthrough('run', blockUI);
                expect(wrapper.find(JoyRide).props().run).toBe(false);
            });

            it('and walkthrough equals "finished" should set run prop to false', () => {
                wrapper = shallowWalkthrough('finished', blockUI);
                expect(wrapper.find(JoyRide).props().run).toBe(false);
            });
        });

        describe('when loading blockUI is equal 0', () => {
            const blockUI = 0;

            it('and walkthrough equals "run" should set run prop to true', () => {
                wrapper = shallowWalkthrough('run', blockUI);
                expect(wrapper.find(JoyRide).props().run).toBe(true);
            });

            it('and walkthrough equals "finished" should set run prop to false', () => {
                wrapper = shallowWalkthrough('finished', blockUI);
                expect(wrapper.find(JoyRide).props().run).toBe(false);
            });
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
        xit('should dispatch finishWalkthrough when tour is finished or skipped', () => {
            wrapper.find(JoyRide).props().callback({
                type: 'finished'
            });
            expect(finishWalkthrough).toHaveBeenCalled();
        });
    });
});
