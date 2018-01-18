import React, {
  Component
} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar/Sidebar';
import ContentArea from '../components/ContentArea/ContentArea';
import Websocket from '../api/websocket';
import store from '../model/store';
import Model from '../model/model';
import token from '../resources/token';
const decode  = require('jwt-decode');

export class FireTeam extends Component {
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
            platform: decodedToken.platform,
            skillRating: 2400
        });
    }

    componentWillUnmount() {
        this.state.websocket.disconnect();
    }

    render() {
        return (
            <div className="App flex stretch">
                <Helmet
                link={[
                  {
                    rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
                  }
                ]}
                />
                <Sidebar/>
                <ContentArea/>
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
