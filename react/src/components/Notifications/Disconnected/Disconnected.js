import React from 'react';

const Disconnected = () => {

    return (
        <div className="Disconnected">
            <div className="icon-container">
                <i className="icon fa fa-plug"/>
            </div>
            <div className="body">
                <div className="title">
                    You have been disconnected
                </div>
                <div className="message">
                    Refresh the page to reconnect
                </div>
            </div>
        </div>
    );
};

export default Disconnected;