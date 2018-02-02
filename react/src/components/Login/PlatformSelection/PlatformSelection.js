import React from 'react';
import PropTypes from 'prop-types';

const PlatformSelection = ({onClick}) => {
     //TODO: Disable ability to click outside of radio, makes state undefined
     //TODO: remove hardcoding of pc, xbl, pxn
     return(
        <div className="PlatformSelection" onClick={(event) => {onClick(event);}}>
            <input type="radio" name="platform" value="pc" defaultChecked/>Battle.net
            <input type="radio" name="platform" value="xbl" />XBL
            <input type="radio" name="platform" value="psn" />PSN
        </div>
    );
};

PlatformSelection.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default PlatformSelection;
