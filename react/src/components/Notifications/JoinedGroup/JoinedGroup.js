import React from 'react';

const JoinedGroup = () => {

    return (
        <div className="JoinedGroup">
            <div className="icon-container">
                <i className="icon fa fa-thumbs-up"></i>
            </div>
            <div className="body">
                <div className="title">
                    {`You've joined` } <b>Luckybomb's</b> {`group!`}
                </div>
                <div className="message">
                    Add <b>Luckybomb#1470</b> {`while you wait for other players to join`}
                </div>
            </div>
        </div>
    );
};

export default JoinedGroup;