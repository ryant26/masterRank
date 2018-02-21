import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';

import UserStatsContainer from './UserStatsContainer';
import HeroImages from './HeroImages/HeroImages';
import Model from '../../model/model';
import { getHeroes } from '../../resources/heroes';

const getMixedHeroes = () => {
    let heroes = getHeroes();
    heroes[0].platformDisplayName = 'notMyName';
    heroes[1].stats = undefined;
    return heroes;
};

const mockStore = configureStore();
const shallowUserStatsContainer = (store, hero, invitable) => {
    return shallow(
       <UserStatsContainer store={store} hero={hero} invitable={invitable}/>
    ).dive();
};

describe('UserStatsContainer Component', () => {
    const heroes = getMixedHeroes();
    const store = mockStore({
        heroes
    });
    const hero = {
        platformDisplayName: heroes[1].platformDisplayName,
        skillRating: heroes[1].skillRating
    };
    let wrapper;

    beforeEach(() => {
        wrapper = shallowUserStatsContainer(store, hero, false);
    });

    it('should render without exploding', () => {
        expect(wrapper.find(UserStatsContainer)).toBeTruthy();
    });

    it('should render heroImages', () => {
        expect(wrapper.find(HeroImages)).toHaveLength(1);
    });

    it("should pass all hero names that belong to the user to HeroImages' props in order ", () => {
        let currentUserDisplayName = hero.platformDisplayName;
        let userHeroes = heroes.filter((hero) => hero.platformDisplayName === currentUserDisplayName);

        wrapper.find(HeroImages).props().heroNames.forEach((heroName, i) => {
                expect(heroName).toBe(userHeroes[i].heroName);
        });
    });

    it('should call model invite player when when the plus-container div is clicked', () => {
        wrapper = shallowUserStatsContainer(store, hero, true);
        Model.inviteUserToGroup = jest.fn();
        wrapper.find('.button-secondary').simulate('click');
        expect(Model.inviteUserToGroup).toHaveBeenCalledWith({
            platformDisplayName: hero.platformDisplayName,
            heroName: hero.heroName
        });
    });

    it('should match the snapshot', () => {
        let component = renderer.create(
            <UserStatsContainer store={store} hero={hero} invitable={true}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});