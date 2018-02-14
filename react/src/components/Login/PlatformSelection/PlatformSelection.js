import React from 'react';
import PropTypes from 'prop-types';

const PlatformSelection = ({onChange, selectedPlatform}) => {
    const pc = 'pc';
    const psn = 'psn';
    const xbl = 'xbl';

     return(
        <form className="PlatformSelection toggle-buttons">
            <input type="radio" id="platform-pc" name="platform" value={pc} checked={selectedPlatform === pc} onChange={onChange}/>
            <label htmlFor="platform-pc"><div className="button-content">Battle.net</div></label>
            <input type="radio" id="platform-psn" name="platform" value={psn} checked={selectedPlatform === psn} onChange={onChange}/>
            <label htmlFor="platform-psn"><div className="button-content">PSN</div></label>
            <input type="radio" id="platform-xbl" name="platform" value={xbl} checked={selectedPlatform === xbl} onChange={onChange}/>
            <label htmlFor="platform-xbl"><div className="button-content">XBL</div></label>
        </form>
    );
};

PlatformSelection.propTypes = {
    onChange: PropTypes.func.isRequired,
    selectedPlatform: PropTypes.string.isRequired
};

export default PlatformSelection;
