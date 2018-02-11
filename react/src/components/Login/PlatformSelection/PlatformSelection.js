import React from 'react';
import PropTypes from 'prop-types';

const PlatformSelection = ({onChange, selectedPlatform}) => {
    const pc = 'pc';
    const psn = 'psn';
    const xbl = 'xbl';

     return(
        <form className="PlatformSelection toggle-buttons">
            <input type="radio" id="plat-1" name="platform" value={pc} checked={selectedPlatform === pc} onChange={onChange}/>
            <label htmlFor="plat-1"><div className="button-content">Battle.net</div></label>
            <input type="radio" id="plat-2" name="platform" value={psn} checked={selectedPlatform === psn} onChange={onChange}/>
            <label htmlFor="plat-2"><div className="button-content">PSN</div></label>
            <input type="radio" id="plat-3" name="platform" value={xbl} checked={selectedPlatform === xbl} onChange={onChange}/>
            <label htmlFor="plat-3"><div className="button-content">XBL</div></label>
        </form>
    );
};

PlatformSelection.propTypes = {
    onChange: PropTypes.func.isRequired,
    selectedPlatform: PropTypes.string.isRequired
};

export default PlatformSelection;
