import React, {
  Component
} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import HeroSelector from '../components/HeroSelector/HeroSelector';
import PlayerCard from '../components/PlayerCard/PlayerCard';
import HeroRolesContainer from './HeroRolesContainer';
import * as users from '../resources/users';

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

          <div className="App-header">
            <h2>Fire Team GG</h2>
          </div>

          <HeroSelector />
          <HeroRolesContainer />
          <br /><br />
          <PlayerCard user={users.users[0]}/>          
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
