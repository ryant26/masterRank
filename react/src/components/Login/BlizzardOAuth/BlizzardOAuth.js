import React from 'react';
import PropTypes from 'prop-types';

const BlizzardOAuth = ({region}) => {

    function onClick() {
        window.location.assign(redirectBlizzardAuthUrl());
    }

    function redirectBlizzardAuthUrl() {
        return `/auth/bnet/callback?region=${region}`;
    }

    return(
        <button className="BlizzardOAuth button-primary" onClick={onClick}>
            <div className="button-content">
                LOGIN VIA BATTLE.NET
            </div>
        </button>
    );
};

BlizzardOAuth.propTypes = {
    region: PropTypes.string.isRequired,
};

export default BlizzardOAuth;