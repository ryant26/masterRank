import React, {
  Component
} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
// import HeroRolesContainer from './HeroRolesContainer/HeroRolesContainer';
import HeroSelectorCard from '../components/HeroSelector/HeroSelectorCard';
import Sidebar from '../components/Sidebar/Sidebar';
import Websocket from '../api/websocket';
import store from '../model/store';
import Model from '../model/model';
import token from '../resources/token';
const decode  = require('jwt-decode');

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            websocket: new Websocket(token)
        };

        Model.initialize(this.state.websocket, store);

        //TEMPORARY
        const decodedToken = decode(token);
        Model.updateUser({
            platformDisplayName: decodedToken.platformDisplayName,
            region: decodedToken.region,
            platform: decodedToken.platform
        });
    }

    componentWillUnmount() {
        this.state.websocket.disconnect();
    }

    render() {
        const contentStyle = {
            padding: '24px'
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
                <div className="flex">
                    <Sidebar user={this.props.location.state.user}/>
                    <div className="flex flex-column" style={contentStyle}>
                        <HeroSelectorCard/>
                        {/*<HeroRolesContainer />*/}
                    </div>
                </div>
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
