import React, {
  Component
} from 'react';

import Sidebar from 'components/Sidebar/Sidebar';
import ContentArea from 'components/ContentArea/ContentArea';
import GroupInfoModal from 'components/Modal/GroupInfoModal';
import FullScreenLoadingSpinner from 'components/LoadingSpinner/FullPageLoadingSpinner';
import Websocket from 'api/websocket';
import Model from 'model/model';
import store from 'model/store';

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
                <FullScreenLoadingSpinner/>
            </div>
        );
    }
}