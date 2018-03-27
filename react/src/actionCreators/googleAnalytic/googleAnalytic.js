import * as googleAnalyticActionTypes from '../../actiontypes/googleAnalytic';

export const startLoginTrackingEvent = (platform) => {
  return {
    type: googleAnalyticActionTypes.START_LOGIN,
    label: platform
  };
};

export const stopLoginTrackingEvent = (platformDisplayName) => {
  return {
    type: googleAnalyticActionTypes.STOP_LOGIN,
    label: platformDisplayName
  };
};

export const clickConsoleUserSearchTrackingEvent = (query) => {
  return {
    type: googleAnalyticActionTypes.CLICK_CONSOLE_USER_SEARCH,
    label: query
  };
};

export const sendGroupInviteTrackingEvent = () => {
  return {
    type: googleAnalyticActionTypes.SEND_GROUP_INVITE,
    label: 'SEND_GROUP_INVITE'
  };
};

export const acceptGroupInviteTrackingEvent = () => {
  return {
    type: googleAnalyticActionTypes.ACCEPT_GROUP_INVITE,
    label: 'ACCEPT_GROUP_INVITE'
  };
};

export const viewPlayerStatsTrackingEvent = () => {
  return {
    type: googleAnalyticActionTypes.VIEW_PLAYER_STATS,
    label: 'VIEW_PLAYER_STATS'
  };
};

export const viewTeamStatsTrackingEvent = () => {
  return {
    type: googleAnalyticActionTypes.VIEW_TEAM_STATS,
    label: 'VIEW_TEAM_STATS'
  };
};

export const clickFeedbackTrackingEvent = () => {
  return {
    type: googleAnalyticActionTypes.CLICK_FEEDBACK,
    label: 'CLICK_FEEDBACK'
  };
};

export const clickTutorialTrackingEvent = () => {
  return {
    type: googleAnalyticActionTypes.CLICK_TUTORIAL,
    label: 'CLICK_TUTORIAL'
  };
};

export const updatePreferredHeroesTrackingEvent = () => {
  return {
    type: googleAnalyticActionTypes.UPDATE_PREFERRED_HEROES,
    label: 'UPDATE_PREFERRED_HEROES'
  };
};