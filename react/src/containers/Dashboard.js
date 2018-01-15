import React, {
  Component
} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
// import HeroRolesContainer from './HeroRolesContainer/HeroRolesContainer';
import HeroSelectorCard from '../components/HeroSelector/HeroSelectorCard';
import Sidebar from '../components/Sidebar/Sidebar';
import Websocket from '../api/websocket';
import Model from '../model/model';
import token from '../resources/token';


export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            websocket: new Websocket(token)
        };

        Model.initialize(this.state.websocket, this.props.store);
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
                    <Sidebar user={this.props.user} />
                    <div className="flex flex-column" style={contentStyle}>
                        <HeroSelectorCard/>
                        {/*<HeroRolesContainer />*/}
                    </div>
                </div>
            </div>
        );
    }
}
