import React from 'react';
import PropTypes from 'prop-types';

const PlatformSelection = ({onClick}) => {
     //TODO: Disable ability to click outside of radio, makes state undefined
     //TODO: remove hardcoding of pc, xbl, pxn
     return(
        <div className="PlatformSelection toggle-buttons" onClick={(event) => {onClick(event);}}>
            <input type="radio" id="plat-1" name="platform" value="pc" defaultChecked/>
            <label htmlFor="plat-1"><div className="button-content">Battle.net</div></label>
            <input type="radio" id="plat-2" name="platform" value="psn" />
            <label htmlFor="plat-2"><div className="button-content">PSN</div></label>
            <input type="radio" id="plat-3" name="platform" value="xbl" />
            <label htmlFor="plat-3"><div className="button-content">XBL</div></label>
        </div>
    );
};

PlatformSelection.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default PlatformSelection;
