import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import HeroButton from '../../../ContentArea/DashboardHome/HeroSelector/HeroButton/HeroButton';
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
        wrapper = mount(getPreferredHeroSelector());
    });

    it('Should render without exploding', () => {
        const PreferredHeroSelectorNode = wrapper.find(PreferredHeroSelector);
        expect(PreferredHeroSelectorNode.length).toBeTruthy();
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
        wrapper = mount(getPreferredHeroSelector(['doomfist', 'ana'], 2));
        expect(wrapper.find(HeroSelector).props().selectedHeroes).toEqual(expect.arrayContaining(['ana']));
    });

    it('Should hide the remove button for slots with no hero selected', () => {
        wrapper = mount(getPreferredHeroSelector(['doomfist'], 2));
        expect(wrapper.find('.button-six').length).toBeFalsy();
    });

    it('Should show the remove button for slots with a hero selected', () => {
        wrapper = mount(getPreferredHeroSelector(['doomfist'], 1));
        expect(wrapper.find('.button-six').length).toBeTruthy();
    });

    it('Should hide the save button when no heroes are preferred', () => {
        wrapper = mount(getPreferredHeroSelector([], 1));
        expect(wrapper.find('.button-primary').length).toBeFalsy();
    });

    it('Should show the save button when heroes are preferred', () => {
        wrapper = mount(getPreferredHeroSelector(['doomfist'], 1));
        expect(wrapper.find('.button-primary').length).toBeTruthy();
    });

    describe('Clicking on a hero icon', () => {
        it('Should set selectedHero in the state', () => {
            wrapper.find(HeroButton).at(0).simulate('click');
            expect(wrapper.find('PreferredHeroSelector').instance().state.selectedHero).toEqual('doomfist');
        });

        it('Should call the setHeroPreference function', () => {
            let callback = jest.fn();
            wrapper = mount(getPreferredHeroSelector([], 1, jest.fn(), callback));
            wrapper.find(HeroButton).first().simulate('click');

            expect(callback).toHaveBeenCalledWith('doomfist');
        });

        it('Should not call the setHeroPreference for duplicate heroes', () => {
            let callback = jest.fn();
            wrapper = mount(getPreferredHeroSelector(['doomfist'], 1, jest.fn(), callback));
            wrapper.find(HeroButton).first().simulate('click');

            expect(callback).not.toHaveBeenCalled();
        });

        it('Should set the hero and message for the save action', () => {
            let callback = jest.fn();
            wrapper = mount(getPreferredHeroSelector([], 1, jest.fn(), callback));
            wrapper.find(HeroButton).first().simulate('click');

            expect(wrapper.state(['heroForLastAction'])).toBe('doomfist');
            expect(wrapper.state(['lastActionTaken'])).toEqual(expect.stringContaining('saved'));
        });

        it('Should call the setSelectedHeroSlot function with an incremented slot', () => {
            let callback = jest.fn();
            wrapper = mount(getPreferredHeroSelector([], 1, jest.fn(), jest.fn(), callback));
            wrapper.find(HeroButton).first().simulate('click');

            expect(callback).toHaveBeenCalledWith(2);
        });
    });

    describe('Clicking on a hero slot', () => {
        it('Should call the setSelectedHeroSlot function', () => {
            let callback = jest.fn();
            wrapper = mount(getPreferredHeroSelector([], 1, jest.fn(), jest.fn(), callback));
            wrapper.find(HeroSlot).at(2).simulate('click');
            expect(callback).toHaveBeenCalledWith(3);
        });
    });

    describe('Clicking on the remove button', () => {
        it('Should call the clearHeroPreference function', () => {
            let callback = jest.fn();
            let hero = 'doomfist';

            wrapper = mount(getPreferredHeroSelector([hero], 1, callback));
            expect(callback).not.toHaveBeenCalled();
            wrapper.find('.button-six').simulate('click');
            expect(callback).toHaveBeenCalled();
        });

        it('Should set the hero for last action in state', () => {
            const hero = 'doomfist';
            wrapper = mount(getPreferredHeroSelector([hero], 1));
            expect(wrapper.state(['heroForLastAction'])).toBe('');
            wrapper.find('.button-six').simulate('click');
            expect(wrapper.state(['heroForLastAction'])).toBe(hero);
        });

        it('Should set the last action taken in state', () => {
            const hero = 'doomfist';
            wrapper = mount(getPreferredHeroSelector([hero], 1));
            expect(wrapper.state(['lastActionTaken'])).toBe('');
            wrapper.find('.button-six').simulate('click');
            expect(wrapper.state(['lastActionTaken'])).toEqual(expect.stringContaining('removed'));
        });
    });

    describe('Clicking on the save button', () => {
        it('Should close the modal', () => {
            let callback = jest.fn();

            wrapper = mount(getPreferredHeroSelector(['doomfist'], 1, jest.fn(), jest.fn(), jest.fn(), callback));
            expect(callback).not.toHaveBeenCalled();
            wrapper.find('.button-primary').simulate('click');
            expect(callback).toHaveBeenCalled();
        });
    });

    describe('Setting the selectedHeroSlot prop', () => {
        it('Should select the corrisponding hero in the selector', () => {
            wrapper = mount(getPreferredHeroSelector(['doomfist', 'ana'], 2));
            expect(wrapper.state(['selectedHero'])).toBe('ana');
        });
    });

});