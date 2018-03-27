import GoogleAnalyticTracker from './GoogleAnalyticTracker';
import { UPDATE_REGION as updateRegionAction } from 'actiontypes/region';

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

    describe('when in development environment', () => {
        const action = 'action';
        const category = 'googleAnalytic';
        const label = 'label';
        const gaEvent = {
            type: `${category}/${action}`,
            label: label
        };
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

    describe('when in development production', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'not development';
            tracker = new GoogleAnalyticTracker(gtag);
        });

        describe('trackEvent when passed a', () => {

            describe('google analytic action', () => {
                const action = 'action';
                const category = 'googleAnalytic';
                const label = 'label';
                const gaEvent = {
                    type: `${category}/${action}`,
                    label: label
                };

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

            describe('region action', () => {
                const regionAction = updateRegionAction.split('/');
                const category = regionAction[0];
                const action = regionAction[1];
                const region = 'us';
                const regionEvent = {
                    type: `${category}/${action}`,
                    region
                };

                beforeEach(() => {
                    tracker.trackEvent(regionEvent);
                });

                it('should call gtag with', () => {
                    expect(gtag).toHaveBeenCalledWith(
                        'event',
                        action,
                        {
                            event_category: category,
                            event_label: region
                        }
                    );
                });
            });

            describe('all remaining actions', () => {
                const action = 'action';
                const category = 'category';
                const nonGAevent = {
                    type: `${category}/${action}`
                };

                beforeEach(() => {
                    tracker.trackEvent(nonGAevent);
                });

                it('should call gtag with', () => {
                    expect(gtag).toHaveBeenCalledWith(
                        'event',
                        action,
                        {
                            event_category: category
                        }
                    );
                });
            });
        });
    });
});