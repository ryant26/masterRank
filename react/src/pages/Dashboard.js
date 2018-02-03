import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';

import Sidebar from '../components/Sidebar/Sidebar';
import ContentArea from '../components/ContentArea/ContentArea';
import GroupInfoModal from '../components/Modal/GroupInfoModal';
import Websocket from '../api/websocket';
import Model from '../model/model';
import store from '../model/store';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            websocket: new Websocket(window.localStorage.accessToken)
        };

        Model.initialize(this.state.websocket, store);
    }

    componentWillUnmount() {
        this.state.websocket.disconnect();
    }

    render() {

        return (
            <div className="Dashboard flex stretch grow">
                <Sidebar />
                <ContentArea/>
                <GroupInfoModal/>
            </div>
        );
    }
}

Dashboard.propTypes = {
    user: PropTypes.object.isRequired
};