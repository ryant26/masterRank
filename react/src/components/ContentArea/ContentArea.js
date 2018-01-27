import React from 'react';
import {Route} from 'react-router-dom';
import {home, allInvites} from "../Routes/links";
import DashboardHome from './Home/Home';
import InvitesGrid from './InvitesGrid/InvitesGrid';

const ContentArea = () => {
    return (
        <div className="contentArea flex stretch">
            <Route exact path={home} component={DashboardHome}/>
            <Route path={allInvites} component={InvitesGrid}/>
        </div>
    );
};

export default ContentArea;