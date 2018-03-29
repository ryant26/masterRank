import { generateMockUser, getMockSocket, mockGetState } from 'utilities/test/mockingUtilities';

import { preferredHeroNotification } from 'components/Notifications/Notifications';
jest.mock('components/Notifications/Notifications');

import { updateHeroes as updatePreferredHeroesAction } from 'actionCreators/preferredHeroes/preferredHeroes';
jest.mock('actionCreators/preferredHeroes/preferredHeroes');
import { pushBlockingEvent as pushBlockingLoadingAction } from "actionCreators/loading";
jest.mock('actionCreators/loading');
import { updatePreferredHeroesTrackingEvent } from 'actionCreators/googleAnalytic/googleAnalytic';
jest.mock('actionCreators/googleAnalytic/googleAnalytic');

import { updatePreferredHeroesAsync } from 'actionCreators/preferredHeroes/updatePreferredHeroesAsync';

describe('updatePreferredHeroesAsync', () => {
    const user = generateMockUser();
    const preferredHeroNames = ['genji', 'tracer', 'widowmaker'];
    const notPreferredHeroNames = ['winston', 'phara'];
    let dispatch;
    let socket;
    let getState;

    beforeEach(() => {
        dispatch = jest.fn();
        socket = getMockSocket();
        getState = mockGetState({
            user,
            preferredHeroes: {
                heroes: preferredHeroNames
            }
        });
    });

    afterEach(() => {
        preferredHeroNotification.mockClear();
        updatePreferredHeroesAction.mockClear();
        pushBlockingLoadingAction.mockClear();
    });

    it('Should send the removeHero socket event for missing heroes only', function(done) {
        socket.removeHero = function(heroName) {
            expect(heroName).toBe(preferredHeroNames[2]);
            done();
        };

        updatePreferredHeroesAsync([...preferredHeroNames.slice(0,2), notPreferredHeroNames[0]], socket)(dispatch, getState);
    });

    it('should remove preferred heroes from the last index if the new preferred heroes list is shorter', (done) => {
        socket.removeHero = function(heroName) {
            expect(heroName).toBe(preferredHeroNames[2]);
            done();
        };

        updatePreferredHeroesAsync(preferredHeroNames.slice(0,2), socket)(dispatch, getState);
    });

    it('should send a preferred hero notifications for each new preferred hero', function() {
        updatePreferredHeroesAsync(notPreferredHeroNames, socket)(dispatch, getState);
        notPreferredHeroNames.forEach((heroName) => {
            expect(preferredHeroNotification).toHaveBeenCalledWith(heroName);
        });
    });

    it('should add each new preferred hero to the server', function() {
        updatePreferredHeroesAsync(notPreferredHeroNames, socket)(dispatch, getState);
        notPreferredHeroNames.forEach((heroName, i) => {
            expect(socket.addHero).toHaveBeenCalledWith(heroName, (i+1));
        });
    });

    it('should push one loading screen for each new preferred hero added to server', () => {
        updatePreferredHeroesAsync(notPreferredHeroNames, socket)(dispatch, getState);
        expect(pushBlockingLoadingAction.mock.calls.length).toBe(notPreferredHeroNames.length);
    });

    it('should call update preferred heroes action', function() {
        updatePreferredHeroesAsync(notPreferredHeroNames, socket)(dispatch, getState);
        expect(updatePreferredHeroesAction).toHaveBeenCalledWith(notPreferredHeroNames);
    });

    it("should call update preferred heroes tracking event with user's platform display name", function() {
        updatePreferredHeroesAsync(notPreferredHeroNames, socket)(dispatch, getState);
        expect(updatePreferredHeroesTrackingEvent).toHaveBeenCalledWith(user.platformDisplayName);
    });

    it('should remove heroes before attempting to add them', () => {
        let removeHeroCalled = false;
        let addHeroCalled = false;

        socket.removeHero = () => {
            removeHeroCalled = true;
            expect(addHeroCalled).toBeFalsy();
        };

        socket.addHero = () => {
            addHeroCalled = true;
            expect(removeHeroCalled).toBeTruthy();
        };

        updatePreferredHeroesAsync(notPreferredHeroNames, socket)(dispatch, getState);
    });
});