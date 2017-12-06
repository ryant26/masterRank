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
import InvitesContainer from '../components/Invites/InvitesContainer';
import Websocket from '../api/websocket';
import Model from '../model/model';
import token from '../resources/token';

export class FireTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            websocket: new Websocket(token)
        };
        Model.initialize(this.state.websocket);
    }

    componentWillUnmount() {
        this.state.websocket.disconnect();
    }

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
              <InvitesContainer/>
            </div>
        );
    }
}

const mapStateToProps = (state) => (
  {
    store: state
  }
);

export default connect(mapStateToProps)(FireTeam);
