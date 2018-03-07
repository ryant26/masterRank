class GoogleAnalyticTracker {

    constructor(gtag) {
        this.gtag = gtag;
    }

    //TODO: figure out if dev flag can be more dynamic
    trackEvent(action, dev=false) {
        let [eventCategory, eventAction] = action.type.split('/');
        if(dev) {
            console.log(`GA event= [${action.region}, ${eventCategory}, ${eventAction}]`);
        } else {
            this.gtag('event', eventAction, {
              event_category: eventCategory,
              event_label: action.region
            });
        }
    }
}

export default GoogleAnalyticTracker;

