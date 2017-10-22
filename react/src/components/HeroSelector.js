import React, {
  Component
} from 'react'

import * as AllHeroes from '../resources/allHeroNames.js';
import SelectorButton from './SelectorButton.js'

export default class HeroSelector extends Component {

  render() {
    const selectorStyle = {
      'display': 'flex',
      'flexWrap': 'wrap',
      // 'width': '1100px',
    }

    return (
      <div style={selectorStyle}>
      {
        AllHeroes.names.map(name => {
          return (
            <SelectorButton heroName={name} key={name}/>
          )
        })
      }
      </div>
    );
  }
}
