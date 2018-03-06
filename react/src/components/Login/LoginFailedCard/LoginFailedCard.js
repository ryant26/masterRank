import React from 'react';

const LoginFailedCard = () => {
    const getQueryParameters = (url = window.location.search) => {
        url = url.replace('?', '');
        let params = {};

        url.split('&').forEach((querySubstring) => {
            querySubstring = decodeURIComponent(querySubstring);
            let [key, value] = querySubstring.split('=');
            params[key] = value;
        });

        return params;
    };

    const queryParameters = getQueryParameters();

    const title = queryParameters.platformDisplayName ?
        `Unable to retrieve the account ${queryParameters.platformDisplayName}.` :
        'Unable to retrieve your account.';

    return queryParameters.failedLogin ? (
        <div className="LoginFailedCard card">
            <div className="body flex flex-column align-center">
                <h2 className="error-title">
                    {title}
                </h2>
                <h3 className="suggestions">
                    <div>We could not retrieve any Overwatch information associated with your account.</div>
                    <div>Please try again in a few minutes or try using an incognito window.</div>
                </h3>
            </div>
        </div>
    ) : '';
};

export default LoginFailedCard;