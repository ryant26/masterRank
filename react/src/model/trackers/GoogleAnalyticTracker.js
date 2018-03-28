class GoogleAnalyticTracker {

    constructor(gtag) {
        this.gtag = gtag;
    }

    trackEvent(event) {
        let [category, action] = event.type.split('/');
        if(event.label) {
            if(process.env.NODE_ENV === 'development') {
                console.log(`GA event= [${category}, ${action}, ${event.label}]`); // eslint-disable-line
            } else {
                this.gtag('event', action, {
                  event_category: category,
                  event_label: event.label
                });
            }
        }
    }
}

export default GoogleAnalyticTracker;

