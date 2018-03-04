import React from 'react';

import { feedback } from '../../../Routes/links';

const AlphaCard = () => {
    const feedbackLink = ( <a className="feedback-link" href={feedback}><b>feedback</b></a> );

    return (
        <div className="AlphaCard">
            Welcome to Fireteam.gg, thanks for participating in our Alpha release!
            Please send us any {feedbackLink} regarding your experience with Fireteam.gg
        </div>
    );
};

export default AlphaCard;