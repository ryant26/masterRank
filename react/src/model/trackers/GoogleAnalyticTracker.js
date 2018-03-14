class GoogleAnalyticTracker {

    constructor(gtag) {
        this.gtag = gtag;
    }

    trackEvent(action) {
        let [eventCategory, eventAction] = action.type.split('/');
        if(process.env.NODE_ENV === 'development') {
            console.log(`GA event= [${action.region}, ${eventCategory}, ${eventAction}]`); // eslint-disable-line
        } else {
            this.gtag('event', eventAction, {
              event_category: eventCategory,
              event_label: action.region
            });
        }
    }
}

export default GoogleAnalyticTracker;

