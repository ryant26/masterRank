const GoogleAnalytic = (tracker) => {
    /* eslint-disable */
    return store => next => action => {
            if(!action.type.includes('loading')) {
                tracker.trackEvent(action);
            }

        return next(action);
    };
    /* eslint-enable */
};

export default GoogleAnalytic;