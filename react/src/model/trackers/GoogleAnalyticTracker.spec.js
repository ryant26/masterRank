import GoogleAnalyticTracker from './GoogleAnalyticTracker';

const currentNodeEnv = process.env.NODE_ENV;

describe('GoogleAnalyticTracker', () => {
    let tracker;
    let gtag = jest.fn();

    beforeEach(() => {
        process.env.NODE_ENV = 'not development';
        tracker = new GoogleAnalyticTracker(gtag);
    });

    afterEach(() => {
         process.env.NODE_ENV = currentNodeEnv;
    });

    it('should construct with out error', () => {
        expect(tracker).toBeDefined();
    });

    describe('when event has a label', () => {
        const action = 'action';
        const category = 'googleAnalytic';
        const label = 'label';
        const gaEvent = {
            type: `${category}/${action}`,
            label: label
        };

        describe('when in development environment', () => {

            beforeEach(() => {
                window.console.log = jest.fn();
                process.env.NODE_ENV = 'development';
                tracker = new GoogleAnalyticTracker(gtag);
                tracker.trackEvent(gaEvent);
            });

            it('should call console.log with', () => {
                expect(console.log).toHaveBeenCalledWith(`GA event= [${category}, ${action}, ${label}]`); // eslint-disable-line
            });
        });

        describe('when in production environment', () => {

            beforeEach(() => {
                process.env.NODE_ENV = 'production';
                tracker = new GoogleAnalyticTracker(gtag);
            });

            describe('trackEvent when passed an event', () => {

                beforeEach(() => {
                    tracker.trackEvent(gaEvent);
                });

                it('should call gtag with', () => {
                    expect(gtag).toHaveBeenCalledWith(
                        'event',
                        action,
                        {
                            event_category: category,
                            event_label: label
                        }
                    );
                });
            });
        });
    });
});