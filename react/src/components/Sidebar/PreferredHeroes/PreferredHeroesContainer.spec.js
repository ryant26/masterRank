import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

import PreferredHeroesContainer from './PreferredHeroesContainer';

const mockStore = configureStore();

describe('<PreferredHeroesContainer/>', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    store = mockStore({preferredHeroes: [{heroName: 'soldier76'}]});
    wrapper = mount(<PreferredHeroesContainer store={store}/>);

  });

  it('Should render without exploding', () => {
      const PreferredHerosContainer = wrapper.find(PreferredHeroesContainer);
      expect(PreferredHerosContainer.length).toBeTruthy();
  });

  it('Should render in the correct format', () => {
    const component = renderer.create(
      <PreferredHeroesContainer store={store}/>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});