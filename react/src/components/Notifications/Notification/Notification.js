import React from 'react';
import Proptypes from 'prop-types';

const Notification = ({type, icon, title, message}) => {

    return (
        <div className="Notification flex">
            <div className={`icon-container flex justify-center align-center ${type}`}>
                <i className={`icon ${icon}`}/>
            </div>
            <div className="body">
                <div className="title">
                    {title}
                </div>
                <div className="message">
                    {message}
                </div>
            </div>
        </div>
    );
};

Notification.propTypes = {
    type: Proptypes.oneOf(['success', 'warning', 'error']),
    icon: Proptypes.string.isRequired,
    title: Proptypes.oneOfType([Proptypes.string, Proptypes.node]).isRequired,
    message: Proptypes.oneOfType([Proptypes.string, Proptypes.node]).isRequired,

};

export default Notification;