import React from 'react';
import PropTypes from 'prop-types';

const PlatformSelectionPage = ({region}) => {

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
        <div className="PlatformSelectionPage">
            <button onClick={() => {onClick('pc');}}>PC</button>
            <button onClick={() => {onClick('xbl');}}>Xbox</button>
            <button onClick={() => {onClick('psn');}}>Play Station</button>
        </div>
    );
};

PlatformSelectionPage.propTypes = {
    region: PropTypes.string.isRequired,
};

export default PlatformSelectionPage;
