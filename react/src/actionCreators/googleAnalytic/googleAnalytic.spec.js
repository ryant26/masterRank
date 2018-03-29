import * as googleAnalyticActionTypes from '../../actiontypes/googleAnalytic';
import * as googleAnalyticActionCreator from './googleAnalytic';

import { generateMockUser } from '../../utilities/test/mockingUtilities';

describe('googleAnalytic',() => {
    const user = generateMockUser();
    const platformDisplayName = user.platformDisplayName;

    it ('should create the SIGN_IN action', () => {
        const platform = 'pc';
        expect(googleAnalyticActionCreator.signInTrackingEvent(platform))
            .toEqual({
                type: googleAnalyticActionTypes.SIGN_IN,
                label: platform
            });
    });

    it ('should create the SYNC_CLIENT_AND_SERVER_HEROES_COMPLETE action', () => {
        expect(googleAnalyticActionCreator.syncClientAndServerTrackingEvent(platformDisplayName))
            .toEqual({
                type: googleAnalyticActionTypes.SYNC_CLIENT_AND_SERVER_HEROES_COMPLETE,
                label: platformDisplayName
            });
    });

    it ('should create the AUTHENTICATION_SUCCESSFUL action', () => {
        expect(googleAnalyticActionCreator.authenticationTrackingEvent(platformDisplayName))
            .toEqual({
                type: googleAnalyticActionTypes.AUTHENTICATION_SUCCESSFUL,
                label: platformDisplayName
            });
    });

    it ('should create the CLICK_CONSOLE_USER_SEARCH action', () => {
        let query = platformDisplayName;
        expect(googleAnalyticActionCreator.clickConsoleUserSearchTrackingEvent(query))
            .toEqual({
                type: googleAnalyticActionTypes.CLICK_CONSOLE_USER_SEARCH,
                label: query
            });
    });

    it ('should create the SEND_GROUP_INVITE action', () => {
        expect(googleAnalyticActionCreator.sendGroupInviteTrackingEvent(platformDisplayName))
            .toEqual({
                type: googleAnalyticActionTypes.SEND_GROUP_INVITE,
                label: platformDisplayName
            });
    });

    it ('should create the ACCEPT_GROUP_INVITE action', () => {
        expect(googleAnalyticActionCreator.acceptGroupInviteTrackingEvent(platformDisplayName))
            .toEqual({
                type: googleAnalyticActionTypes.ACCEPT_GROUP_INVITE,
                label: platformDisplayName
            });
    });

    it ('should create the VIEW_PLAYER_STATS action', () => {
        expect(googleAnalyticActionCreator.viewPlayerStatsTrackingEvent(platformDisplayName))
            .toEqual({
                type: googleAnalyticActionTypes.VIEW_PLAYER_STATS,
                label: platformDisplayName
            });
    });

    it ('should create the VIEW_TEAM_STATS action', () => {
        expect(googleAnalyticActionCreator.viewTeamStatsTrackingEvent(platformDisplayName))
            .toEqual({
                type: googleAnalyticActionTypes.VIEW_TEAM_STATS,
                label: platformDisplayName
            });
    });

    it ('should create the CLICK_FEEDBACK action', () => {
        expect(googleAnalyticActionCreator.clickFeedbackTrackingEvent(platformDisplayName))
            .toEqual({
                type: googleAnalyticActionTypes.CLICK_FEEDBACK,
                label: platformDisplayName
            });
    });

    it ('should create the UPDATE_PREFERRED_HEROES action', () => {
        expect(googleAnalyticActionCreator.updatePreferredHeroesTrackingEvent(platformDisplayName))
            .toEqual({
                type: googleAnalyticActionTypes.UPDATE_PREFERRED_HEROES,
                label: platformDisplayName
            });
    });

    it ('should create the SOCKET_DISCONNECT action', () => {
        expect(googleAnalyticActionCreator.socketDisconnectTrackingEvent(platformDisplayName))
            .toEqual({
                type: googleAnalyticActionTypes.SOCKET_DISCONNECT,
                label: platformDisplayName
            });
    });
});