import React from 'react';
import { home } from '../../../Routes/links';

const LogoutButton = () => {

    function onClick() {
        localStorage.clear();
        window.location.assign(home);
    }

    return (
        <a className="LogoutButton" onClick={onClick}>
            Logout
        </a>
    );
};

export default LogoutButton;