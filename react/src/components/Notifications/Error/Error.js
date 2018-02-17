import React from 'react';

const Error = () => {

    return (
        <div className="Error">
            <div className="icon-container">
                <i className="icon fa fa-exclamation"></i>
            </div>
            <div className="body">
                <div className="title">
                    {`Something went wrong!`}
                </div>
                <div className="message">
                    {`Error adding hero "tracer", please try again or refresh page`}
                </div>
            </div>
        </div>
    );
};

export default Error;