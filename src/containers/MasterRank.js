import React, {
  Component
} from 'react';
import Helmet from 'react-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as HeroActions from '../actions/hero.js';
import HeroSelector from '../components/HeroSelector.js'
import HeroCard from '../components/HeroCard.js';

class MasterRank extends Component {
  render() {
    const { dispatch, heroes } = this.props;
    const addHero = bindActionCreators(HeroActions.addHero, dispatch)

    const heroCardComponents = heroes.map(hero => {
      return <HeroCard hero={hero} key={hero.name} />
    })

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

          <HeroSelector />

          <div className="HeroCard">
              { heroCardComponents }
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => (
  {
    heroes: state.heroes
  }
);

export default connect(mapStateToProps)(MasterRank);
