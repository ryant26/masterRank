import React from 'react';
import { feedback } from '../../../Routes/links';

const FeedbackButton = () => {

    function onClick() {
        window.location.assign(feedback);
    }

    return (
        <a className="FeedbackButton" onClick={onClick}>
            Feedback
        </a>
    );
};

export default FeedbackButton;