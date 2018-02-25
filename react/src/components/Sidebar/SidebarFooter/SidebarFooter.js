import React from 'react';

import LogoutButton from './LogoutButton/LogoutButton';

const SidebarFooter = () => {
    return (
        <div className="SidebarFooter flex justify-center sidebar-card">
            <LogoutButton/>
        </div>
    );
};

export default SidebarFooter;