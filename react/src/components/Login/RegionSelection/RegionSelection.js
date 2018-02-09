import React from 'react';
import PropTypes from 'prop-types';

const RegionSelection = ({selectedRegion, handleOptionChange}) => {
    const us = 'us';
    const apac = 'apac';
    const eu = 'eu';

    return(
        <form className="RegionSelection toggle-buttons">
            <input type="radio" id="region-1" name="region" value={us} checked={selectedRegion === us} onChange={handleOptionChange}/>
            <label htmlFor="region-1"><div className="button-content">NA</div></label>
            <input type="radio" id="region-2" name="region" value={apac} checked={selectedRegion === apac} onChange={handleOptionChange}/>
            <label htmlFor="region-2"><div className="button-content">APAC</div></label>
            <input type="radio" id="region-3" name="region" value={eu} checked={selectedRegion === eu} onChange={handleOptionChange}/>
            <label htmlFor="region-3"><div className="button-content">EU</div></label>
        </form>
    );
};

RegionSelection.propTypes = {
    handleOptionChange: PropTypes.func.isRequired,
    selectedRegion: PropTypes.string.isRequired
};

export default RegionSelection;