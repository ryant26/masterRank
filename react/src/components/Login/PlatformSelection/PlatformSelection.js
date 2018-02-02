import React from 'react';
import PropTypes from 'prop-types';

const PlatformSelection = ({region}) => {

    function onClick(platform) {
        switch(platform) {
            case 'pc':
                window.location.assign(redirectBlizzardAuthUrl());
                break;
            default:
                window.location.assign('/login');
        }
    }

    function redirectBlizzardAuthUrl() {
        return `/auth/bnet/callback?region=${region}`;
    }

     return(
        <div className="PlatformSelection">
            <button onClick={() => {onClick('pc');}}>PC</button>
            <button onClick={() => {onClick('xbl');}}>Xbox</button>
            <button onClick={() => {onClick('psn');}}>Play Station</button>
        </div>
    );
};

PlatformSelection.propTypes = {
    region: PropTypes.string.isRequired,
};

export default PlatformSelection;
