import React from 'react';

import FeedbackButton from 'components/Sidebar/SidebarFooter/FeedbackButton/FeedbackButton';
import TutorialButton from 'components/Sidebar/SidebarFooter/TutorialButton/TutorialButton';
import LogoutButton from 'components/Sidebar/SidebarFooter/LogoutButton/LogoutButton';

const SidebarFooter = () => {
    return (
        <div className="SidebarFooter flex justify-center sidebar-card">
            <FeedbackButton/>
            <TutorialButton/>
            <LogoutButton/>
        </div>
    );
};

export default SidebarFooter;