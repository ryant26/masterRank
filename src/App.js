import React, {
  Component
} from 'react';
import Helmet from 'react-helmet'

import Header from './components/Header.js'
import HeroCard from './components/HeroCard.js'
import HEROES from './resources/heroes.js'

export default class App extends Component {
  render() {
    return (
        <div className="App">
          <Helmet
            link={[
              {
                rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
              }
            ]}
          />

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
