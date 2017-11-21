import React, {
  Component
} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import HeroSelector from '../components/HeroSelector/HeroSelector';
import PlayerCard from '../components/PlayerCard/PlayerCard';
import HeroRolesContainer from './HeroRolesContainer';
import * as users from '../resources/users';
import Title from '../components/Title/Title';
import PreferredHeroesContainer from '../components/PreferredHeroes/PreferredHeroesContainer';

export class FireTeam extends Component {
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

          <Title/>

          <HeroSelector />
          <HeroRolesContainer />
          <br /><br />
          <PlayerCard user={users.users[0]}/>          
          <PreferredHeroesContainer />
        </div>
    );
  }
}

const mapStateToProps = (state) => (
  {
    heroes: state.heroes
  }
);

export default connect(mapStateToProps)(FireTeam);
