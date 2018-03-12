import React from 'react';

import FeedbackButton from 'components/Sidebar/SidebarFooter/FeedbackButton/FeedbackButton';
import LogoutButton from 'components/Sidebar/SidebarFooter/LogoutButton/LogoutButton';

const SidebarFooter = () => {
    return (
        <div className="SidebarFooter flex justify-center sidebar-card">
            <FeedbackButton/>
            <LogoutButton/>
        </div>
    );
};

export default SidebarFooter;