import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';

import UserStatsContainer from './UserStatsContainer';
import HeroImages from './HeroImages/HeroImages';
import Model from '../../model/model';
jest.mock('../Notifications/Notifications');

import { users } from '../../resources/users';
import { getHeroes } from '../../resources/heroes';


const getMixedHeroes = () => {
    let heroes = getHeroes();
    heroes[0].platformDisplayName = 'notMyName';
    heroes[1].stats = undefined;
    return heroes;
};

const mockStore = configureStore();
const shallowUserStatsContainer = (store, hero, invitable, toggleModal) => {
    return shallow(
       <UserStatsContainer store={store} hero={hero} invitable={invitable} toggleModal={toggleModal}/>
    ).dive();
};

describe('UserStatsContainer Component', () => {
    const heroes = getMixedHeroes();
    const store = mockStore({
        heroes,
        user: users[0]
    });
    const hero = {
        platformDisplayName: heroes[1].platformDisplayName,
        skillRating: heroes[1].skillRating
    };
    const toggleModal = jest.fn();
    let wrapper;

    beforeEach(() => {
        wrapper = shallowUserStatsContainer(store, hero, false, toggleModal);
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

    describe('when when the INVITE TO GROUP button is clicked', () => {

        beforeEach(() => {
            Model.inviteUserToGroup = jest.fn();
            wrapper = shallowUserStatsContainer(store, hero, true, toggleModal);
            wrapper.find('.button-secondary').simulate('click');
        });

        it('should call model invite player with correct heroObj ', () => {
            expect(Model.inviteUserToGroup).toHaveBeenCalledWith({
                platformDisplayName: hero.platformDisplayName,
                heroName: hero.heroName
            });
        });

        it('should call toggleModal', () => {
            expect(toggleModal).toHaveBeenCalled();
        });
    });

    it('should match the snapshot', () => {
        let component = renderer.create(
            <Provider store={store} >
                <UserStatsContainer hero={hero} invitable={true} toggleModal={toggleModal}/>
            </Provider>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});