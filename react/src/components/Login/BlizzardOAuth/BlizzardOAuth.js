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
        <button onClick={onClick}>LOGIN VIA BATTLE.NET</button>
    );
};

BlizzardOAuth.propTypes = {
    region: PropTypes.string.isRequired,
};

export default BlizzardOAuth;