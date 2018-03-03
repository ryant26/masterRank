import React from 'react';

import FeedbackButton from './FeedbackButton/FeedbackButton';
import LogoutButton from './LogoutButton/LogoutButton';

const SidebarFooter = () => {
    return (
        <div className="SidebarFooter flex justify-center sidebar-card">
            <FeedbackButton/>
            <LogoutButton/>
        </div>
    );
};

export default SidebarFooter;