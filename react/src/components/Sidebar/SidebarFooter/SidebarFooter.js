import React from 'react';

import LogoutButton from './LogoutButton/LogoutButton';

const SidebarFooter = () => {
    return (
        <div className="sidebar-footer flex justify-around sidebar-card">
            <a>Settings</a>
            <a>Help</a>
            <LogoutButton/>
        </div>
    );
};

export default SidebarFooter;