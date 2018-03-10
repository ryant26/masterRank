import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import HeroSlot from '../HeroSlot/HeroSlot';
import PreferredHeroSelector from './PreferredHeroSelector';
import HeroSelector from '../../../ContentArea/DashboardHome/HeroSelector/HeroSelector';

const heroNames = require('../../../../../../shared/libs/allHeroNames').names;

const getNames = () => {
    return [heroNames[0], heroNames[1], heroNames[2], heroNames[3], heroNames[4]];
};

const getPreferredHeroSelector = (preferredHeroes = getNames(),
                           selectedHeroSlot = 1,
                           clearHeroPreference = jest.fn(),
                           setHeroPreference = jest.fn(),
                           setSelectedHeroSlot = jest.fn(),
                           closeModal = jest.fn()) => {
    return (
        <PreferredHeroSelector
            preferredHeroes={preferredHeroes}
            selectedHeroSlot={selectedHeroSlot}
            clearHeroPreference={clearHeroPreference}
            setHeroPreference={setHeroPreference}
            setSelectedHeroSlot={setSelectedHeroSlot}
            closeModal={closeModal}
        />
    );
};

describe('<PreferredHeroSelector/>', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(getPreferredHeroSelector());
    });

    it('Should render without exploding', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('Should render in the correct format without any preferred heroes', () => {
        const component = renderer.create(
            getPreferredHeroSelector([])
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Should render in the correct format with preferred heroes', () => {
        const component = renderer.create(getPreferredHeroSelector());
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Should pass the selectedHero to the hero selector', () => {
        wrapper = shallow(getPreferredHeroSelector(['doomfist', 'ana'], 2));
        expect(wrapper.find(HeroSelector).props().selectedHeroes).toEqual(expect.arrayContaining(['ana']));
    });

    it('Should hide the remove button for slots with no hero selected', () => {
        wrapper = shallow(getPreferredHeroSelector(['doomfist'], 2));
        expect(wrapper.find('.button-six').length).toBeFalsy();
    });

    it('Should show the remove button for slots with a hero selected', () => {
        wrapper = shallow(getPreferredHeroSelector(['doomfist'], 1));
        expect(wrapper.find('.button-six').length).toBeTruthy();
    });

    it('Should hide the save button when no heroes are preferred', () => {
        wrapper = shallow(getPreferredHeroSelector([], 1));
        expect(wrapper.find('.button-primary').length).toBeFalsy();
    });

    it('Should show the save button when heroes are preferred', () => {
        wrapper = shallow(getPreferredHeroSelector(['doomfist'], 1));
        expect(wrapper.find('.button-primary').length).toBeTruthy();
    });

    describe('setHeroPreference', () => {
        it('Should set selectedHero in the state', () => {
            wrapper.instance().setHeroPreference('doomfist');
            expect(wrapper.instance().state.selectedHero).toEqual('doomfist');
        });

        it('Should be set as the onHeroSelected prop to heroSelector', () => {
            expect(wrapper.find(HeroSelector).props().onHeroSelected).toBe(wrapper.instance().setHeroPreference);
        });

        it('Should call the setHeroPreference prop for unique heroes', () => {
            let callback = jest.fn();
            wrapper = shallow(getPreferredHeroSelector(['doomfist'], 1, jest.fn(), callback));
            wrapper.instance().setHeroPreference('ana');

            expect(callback).toHaveBeenCalledWith('ana');
        });

        it('Should not call the setHeroPreference prop for duplicate heroes', () => {
            let callback = jest.fn();
            wrapper = shallow(getPreferredHeroSelector(['doomfist'], 1, jest.fn(), callback));
            wrapper.instance().setHeroPreference('doomfist');

            expect(callback).not.toHaveBeenCalled();
        });

        it('Should set the hero and message for the save action', () => {
            let callback = jest.fn();
            wrapper = shallow(getPreferredHeroSelector([], 1, jest.fn(), callback));
            wrapper.instance().setHeroPreference('doomfist');

            expect(wrapper.state(['heroForLastAction'])).toBe('doomfist');
            expect(wrapper.state(['lastActionTaken'])).toEqual(expect.stringContaining('saved'));
        });

        it('Should call the setSelectedHeroSlot function with an incremented slot', () => {
            let callback = jest.fn();
            wrapper = shallow(getPreferredHeroSelector([], 1, jest.fn(), jest.fn(), callback));
            wrapper.instance().setHeroPreference('ana');

            expect(callback).toHaveBeenCalledWith(2);
        });
    });

    describe('SetSelectedSlot', () => {
        it('Should call the setSelectedHeroSlot prop with the passed number', () => {
            let callback = jest.fn();
            wrapper = shallow(getPreferredHeroSelector([], 1, jest.fn(), jest.fn(), callback));
            wrapper.instance().setSelectedSlot(3);
            expect(callback).toHaveBeenCalledWith(3);
        });

        it('Should be set as the onSlotSelected prop to the HeroSlots', () => {
            expect(wrapper.find(HeroSlot).first().props().onSlotSelected).toBe(wrapper.instance().setSelectedSlot);
        });
    });

    describe('Clicking on the remove button', () => {
        it('Should call the clearHeroPreference function', () => {
            let callback = jest.fn();
            let hero = 'doomfist';

            wrapper = shallow(getPreferredHeroSelector([hero], 1, callback));
            expect(callback).not.toHaveBeenCalled();
            wrapper.find('.button-six').simulate('click');
            expect(callback).toHaveBeenCalled();
        });

        it('Should set the hero for last action in state', () => {
            const hero = 'doomfist';
            wrapper = shallow(getPreferredHeroSelector([hero], 1));
            expect(wrapper.state(['heroForLastAction'])).toBe('');
            wrapper.find('.button-six').simulate('click');
            expect(wrapper.state(['heroForLastAction'])).toBe(hero);
        });

        it('Should set the last action taken in state', () => {
            const hero = 'doomfist';
            wrapper = shallow(getPreferredHeroSelector([hero], 1));
            expect(wrapper.state(['lastActionTaken'])).toBe('');
            wrapper.find('.button-six').simulate('click');
            expect(wrapper.state(['lastActionTaken'])).toEqual(expect.stringContaining('removed'));
        });
    });

    describe('Clicking on the save button', () => {
        it('Should close the modal', () => {
            let callback = jest.fn();

            wrapper = shallow(getPreferredHeroSelector(['doomfist'], 1, jest.fn(), jest.fn(), jest.fn(), callback));
            expect(callback).not.toHaveBeenCalled();
            wrapper.find('.button-primary').simulate('click');
            expect(callback).toHaveBeenCalled();
        });
    });

    describe('Setting the selectedHeroSlot prop', () => {
        it('Should select the corrisponding hero in the selector', () => {
            wrapper = shallow(getPreferredHeroSelector(['doomfist', 'ana'], 2));
            expect(wrapper.state(['selectedHero'])).toBe('ana');
        });
    });
});