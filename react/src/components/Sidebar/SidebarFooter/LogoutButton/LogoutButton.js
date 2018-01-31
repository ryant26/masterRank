import React from 'react';

const LogoutButton = () => {

    function onClick() {
        localStorage.clear();
        window.location.assign('/login');
    }

    return (
        <a className="LogoutButton" onClick={onClick}>
            Logout
        </a>
    );
};

export default LogoutButton;