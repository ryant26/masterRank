import React, {
  Component
} from 'react';

import Header from './components/Header.js'
import HeroCard from './components/HeroCard.js'
import HEROES from './resources/heroes.js'

export default class App extends Component {
  render() {
    return (
        <div className="App">
          <div className="App-header">
            <h2>Master Rank</h2>
          </div>

          <div className="HeroCard">
            {HEROES.map(function(hero) {
              return <HeroCard hero={hero} key={hero.name} />
            })}
          </div>
        </div>
    );
  }
}
