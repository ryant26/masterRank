import React from 'react';
import PropTypes from 'prop-types';

const Error = ({ error }) => {

    return (
        <div className="Error">
            <div className="icon-container">
                <i className="icon fa fa-exclamation"/>
            </div>
            <div className="body">
                <div className="title">
                    {`Something went wrong!`}
                </div>
                <div className="message">
                    { error }
                </div>
            </div>
        </div>
    );
};

Error.propTypes = {
    error: PropTypes.string.isRequired
};

export default Error;