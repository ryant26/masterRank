import React from 'react';
import PropTypes from 'prop-types';

const PlatformSelection = ({handleOptionChange, selectedPlatform}) => {
    const pc = 'pc';
    const psn = 'psn';
    const xbl = 'xbl';

     return(
        <form className="PlatformSelection toggle-buttons">
            <input type="radio" id="plat-1" name="platform" value={pc} checked={selectedPlatform === pc} onChange={handleOptionChange}/>
            <label htmlFor="plat-1"><div className="button-content">Battle.net</div></label>
            <input type="radio" id="plat-2" name="platform" value={psn} checked={selectedPlatform === psn} onChange={handleOptionChange}/>
            <label htmlFor="plat-2"><div className="button-content">PSN</div></label>
            <input type="radio" id="plat-3" name="platform" value={xbl} checked={selectedPlatform === xbl} onChange={handleOptionChange}/>
            <label htmlFor="plat-3"><div className="button-content">XBL</div></label>
        </form>
    );
};

PlatformSelection.propTypes = {
    handleOptionChange: PropTypes.func.isRequired,
    selectedPlatform: PropTypes.string.isRequired
};

export default PlatformSelection;
