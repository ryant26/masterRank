import React from 'react';
import PropTypes from 'prop-types';

const RegionSelection = ({onClick}) => {
    //TODO: Disable ability to click outside of radio, makes state undefined
    //TODO: remove hardcoded region values
    return(
        <div className="RegionSelection toggle-buttons" onClick={(event) => {onClick(event);}}>
            <input type="radio" id="region-1" name="region" value="us" defaultChecked />
            <label htmlFor="region-1"><div className="button-content">NA</div></label>
            <input type="radio" id="region-2" name="region" value="apac" />
            <label htmlFor="region-2"><div className="button-content">APAC</div></label>
            <input type="radio" id="region-3" name="region" value="eu" />
            <label htmlFor="region-3"><div className="button-content">EU</div></label>
        </div>
    );
};

RegionSelection.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default RegionSelection;