import React, {
  Component
} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import HeroSelector from '../components/HeroSelector/HeroSelector';
import HeroRolesContainer from './HeroRolesContainer/HeroRolesContainer';
import Sidebar from '../components/Sidebar/Sidebar';
import Websocket from '../api/websocket';
import store from '../model/store';
import Model from '../model/model';
import token from '../resources/token';

export class FireTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            websocket: new Websocket(token)
        };

        Model.initialize(this.state.websocket, store);
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
                <div className="flex">
                    <Sidebar/>
                    <div className="flex flex-column">
                        <HeroSelector />
                        <HeroRolesContainer />
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
