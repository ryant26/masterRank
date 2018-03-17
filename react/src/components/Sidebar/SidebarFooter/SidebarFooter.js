import React from 'react';

import FeedbackButton from './FeedbackButton/FeedbackButton';
import TutorialButton from './TutorialButton/TutorialButton';
import LogoutButton from './LogoutButton/LogoutButton';

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