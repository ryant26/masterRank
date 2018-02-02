import React from 'react';
import PropTypes from 'prop-types';

const RegionSelection = ({onClick}) => {
    //TODO: Disable ability to click outside of radio, makes state undefined
    //TODO: remove hardcoded region values
    return(
        <div className="RegionSelection" onClick={(event) => {onClick(event);}}>
            <input type="radio" name="region" value="us" defaultChecked />NA
            <input type="radio" name="region" value="apac" />APAC
            <input type="radio" name="region" value="eu" />EU
        </div>
    );
};

RegionSelection.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default RegionSelection;