import React, {
  Component
} from 'react';
// import HeroRolesContainer from './HeroRolesContainer/HeroRolesContainer';
import HeroSelectorCard from '../components/HeroSelector/HeroSelectorCard';
import Sidebar from '../components/Sidebar/Sidebar';
import Websocket from '../api/websocket';
import Model from '../model/model';
import token from '../resources/token';
import store from '../model/store'

export default class Dashboard extends Component {
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
        const contentStyle = {
            padding: '24px'
        };

        return (
            <div className="flex">
                <Sidebar user={this.props.user} />
                <div className="flex flex-column" style={contentStyle}>
                    <HeroSelectorCard/>
                    {/*<HeroRolesContainer />*/}
                </div>
            </div>
        );
    }
}
