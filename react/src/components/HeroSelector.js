import React, {
  Component
} from 'react';

import * as AllHeroes from '../resources/allHeroNames';
import SelectorButton from './SelectorButton';

export default class HeroSelector extends Component {

  render() {
    const selectorStyle = {
      'display': 'flex',
      'flexWrap': 'wrap',
    };

    return (
      <div style={selectorStyle}>
      {
        AllHeroes.names.map(name => {
          return (
            <SelectorButton heroName={name} key={name}/>
          );
        })
      }
      </div>
    );
  }
}
