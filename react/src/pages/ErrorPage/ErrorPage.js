import React from 'react';
import PropTypes from 'prop-types';

const ErrorPage = ({errorMessage}) => {
    return(
        <div className="ErrorPage">{errorMessage}</div>
    );
};

ErrorPage.propTypes = {
    errorMessage: PropTypes.string.isRequired,
};

export default ErrorPage;