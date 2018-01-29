import React from 'react';
import {Route} from 'react-router-dom';
import {home, allInvites} from "../Routes/links";
import DashboardHome from './DashboardHome/DashboardHome';
import InvitesGrid from './InvitesGrid/InvitesGrid';

const ContentArea = () => {
    return (
        <div className="ContentArea flex stretch grow">
            <Route exact path={home} component={DashboardHome}/>
            <Route path={allInvites} component={InvitesGrid}/>
        </div>
    );
};

export default ContentArea;