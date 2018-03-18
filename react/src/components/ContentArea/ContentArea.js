import React from 'react';
import {Route} from 'react-router-dom';
import {home, allInvites} from "components/Routes/links";
import DashboardHome from 'components/ContentArea/DashboardHome/DashboardHome';
import InvitesGrid from 'components/ContentArea/InvitesGrid/InvitesGrid';

const ContentArea = () => {
    return (
        <div className="ContentArea flex stretch grow">
            <Route exact path={home} component={DashboardHome}/>
            <Route path={allInvites} component={InvitesGrid}/>
        </div>
    );
};

export default ContentArea;