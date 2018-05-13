import React from 'react';
import PropTypes from 'prop-types';

import FeedbackButton from 'components/Sidebar/SidebarFooter/FeedbackButton/FeedbackButton';
import TutorialButton from 'components/Sidebar/SidebarFooter/TutorialButton/TutorialButton';
import LogoutButton from 'components/Sidebar/SidebarFooter/LogoutButton/LogoutButton';
import GDPRButton from 'components/Sidebar/SidebarFooter/GDPRButton/GDPRButton';

const SidebarFooter = ({region}) => {
    return (
        <div className="SidebarFooter flex justify-center sidebar-card">
            <FeedbackButton/>
            <TutorialButton/>
            { region === 'eu' && <GDPRButton/> }
            <LogoutButton/>
        </div>
    );
};

SidebarFooter.propTypes = {
    region: PropTypes.string.isRequired
};

export default SidebarFooter;