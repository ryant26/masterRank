class GoogleAnalyticTracker {

    constructor(gtag) {
        this.gtag = gtag;
    }

    trackEvent(event) {
        let [category, action] = event.type.split('/');
        if(process.env.NODE_ENV === 'development') {
            console.log(`GA event= [${category}, ${action}, ${event.label}]`); // eslint-disable-line
        } else if(category === 'googleAnalytic') {
            this.gtag('event', action, {
              event_category: category,
              event_label: event.label
            });
        } else if(category === 'region') {
            this.gtag('event', action, {
              event_category: category,
              event_label: event.region
            });
        } else {
            this.gtag('event', action, {
              event_category: category
            });
        }
    }
}

export default GoogleAnalyticTracker;

