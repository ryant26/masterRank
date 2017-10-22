import React, {
  Component
} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import HeroSelector from '../components/HeroSelector';
import HeroRoles from '../components/HeroRoles';

export class FireTeam extends Component {
  render() {

    const roleStyle = {
      'display':'flex',
      'flexDirection':'row',
    };

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

          <div className="HeroRoles" style={roleStyle}>
              <HeroRoles role="offense" key="offense"/>
              <HeroRoles role="defense" key="defense"/>
              <HeroRoles role="tank" key="tank"/>
              <HeroRoles role="support" key="support"/>
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

export default connect(mapStateToProps)(FireTeam);
