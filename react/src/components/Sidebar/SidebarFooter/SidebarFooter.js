import React from 'react';

import LogoutButton from './LogoutButton/LogoutButton';

const SidebarFooter = () => {
    return (
        <div className="sidebar-footer flex justify-around sidebar-card">
            <a>Settings</a>
            <a>Help</a>
            <div>
                <LogoutButton/>
                </div>
        </div>
    );
};

export default SidebarFooter;