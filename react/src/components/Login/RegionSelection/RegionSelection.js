import React from 'react';
import PropTypes from 'prop-types';

const RegionSelection = ({onChange, selectedRegion}) => {
    const us = 'us';
    const apac = 'apac';
    const eu = 'eu';

    return(
        <form className="RegionSelection toggle-buttons">
            <input type="radio" id="region-us" name="region" value={us} checked={selectedRegion === us} onChange={onChange}/>
            <label htmlFor="region-us"><div className="button-content">NA</div></label>
            <input type="radio" id="region-apac" name="region" value={apac} checked={selectedRegion === apac} onChange={onChange}/>
            <label htmlFor="region-apac"><div className="button-content">APAC</div></label>
            <input type="radio" id="region-eu" name="region" value={eu} checked={selectedRegion === eu} onChange={onChange}/>
            <label htmlFor="region-eu"><div className="button-content">EU</div></label>
        </form>
    );
};

RegionSelection.propTypes = {
    onChange: PropTypes.func.isRequired,
    selectedRegion: PropTypes.string.isRequired
};

export default RegionSelection;