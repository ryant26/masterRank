import React from 'react';
import PropTypes from 'prop-types';

const JoinedGroup = ({ displayName }) => {

    const leaderName = displayName.replace(/#.*/,"");

    return (
        <div className="JoinedGroup">
            <div className="icon-container">
                <i className="icon fa fa-thumbs-up"/>
            </div>
            <div className="body">
                <div className="title">
                    {`You've joined `}<b>{leaderName}{`'s`}</b>{` group!`}
                </div>
                <div className="message">
                    Add <b>{displayName}</b> {`while you wait for other players to join`}
                </div>
            </div>
        </div>
    );
};

JoinedGroup.propTypes = {
    displayName: PropTypes.string.isRequired
};

export default JoinedGroup;