import * as googleAnalyticActionTypes from '../../actiontypes/googleAnalytic';
import * as googleAnalyticActionCreator from './googleAnalytic';

import { generateMockUser } from '../../utilities/test/mockingUtilities';

describe('googleAnalytic',() => {
    const user = generateMockUser();

    it ('should create the START_LOGIN action', () => {
        const platform = 'pc';
        expect(googleAnalyticActionCreator.startLoginTrackingEvent(platform))
            .toEqual({
                type: googleAnalyticActionTypes.START_LOGIN,
                label: platform
            });
    });

    it ('should create the STOP_LOGIN action', () => {
        expect(googleAnalyticActionCreator.stopLoginTrackingEvent(user.platformDisplayName))
            .toEqual({
                type: googleAnalyticActionTypes.STOP_LOGIN,
                label: user.platformDisplayName
            });
    });

    it ('should create the SEND_GROUP_INVITE action', () => {
        expect(googleAnalyticActionCreator.sendGroupInviteTrackingEvent())
            .toEqual({
                type: googleAnalyticActionTypes.SEND_GROUP_INVITE,
                label: 'SEND_GROUP_INVITE'
            });
    });

    it ('should create the ACCEPT_GROUP_INVITE action', () => {
        expect(googleAnalyticActionCreator.acceptGroupInviteTrackingEvent())
            .toEqual({
                type: googleAnalyticActionTypes.ACCEPT_GROUP_INVITE,
                label: 'ACCEPT_GROUP_INVITE'
            });
    });

    it ('should create the VIEW_PLAYER_STATS action', () => {
        expect(googleAnalyticActionCreator.viewPlayerStatsTrackingEvent())
            .toEqual({
                type: googleAnalyticActionTypes.VIEW_PLAYER_STATS,
                label: 'VIEW_PLAYER_STATS'
            });
    });

    it ('should create the VIEW_TEAM_STATS action', () => {
        expect(googleAnalyticActionCreator.viewTeamStatsTrackingEvent())
            .toEqual({
                type: googleAnalyticActionTypes.VIEW_TEAM_STATS,
                label: 'VIEW_TEAM_STATS'
            });
    });

    it ('should create the CLICK_FEEDBACK action', () => {
        expect(googleAnalyticActionCreator.clickFeedbackTrackingEvent())
            .toEqual({
                type: googleAnalyticActionTypes.CLICK_FEEDBACK,
                label: 'CLICK_FEEDBACK'
            });
    });

    it ('should create the CLICK_TUTORIAL action', () => {
        expect(googleAnalyticActionCreator.clickTutorialTrackingEvent())
            .toEqual({
                type: googleAnalyticActionTypes.CLICK_TUTORIAL,
                label: 'CLICK_TUTORIAL'
            });
    });

    it ('should create the UPDATE_PREFERRED_HEROES action', () => {
        expect(googleAnalyticActionCreator.updatePreferredHeroesTrackingEvent())
            .toEqual({
                type: googleAnalyticActionTypes.UPDATE_PREFERRED_HEROES,
                label: 'UPDATE_PREFERRED_HEROES'
            });
    });
});