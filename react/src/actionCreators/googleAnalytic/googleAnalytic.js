import * as googleAnalyticActionTypes from '../../actiontypes/googleAnalytic';

export const signInTrackingEvent = (platform) => {
  return {
    type: googleAnalyticActionTypes.SIGN_IN,
    label: platform
  };
};

export const authenticationTrackingEvent = (platformDisplayName) => {
  return {
    type: googleAnalyticActionTypes.AUTHENTICATION_SUCCESSFUL,
    label: platformDisplayName
  };
};

export const syncClientAndServerTrackingEvent = (platformDisplayName) => {
  return {
    type: googleAnalyticActionTypes.SYNC_CLIENT_AND_SERVER_HEROES_COMPLETE,
    label: platformDisplayName
  };
};

export const clickConsoleUserSearchTrackingEvent = (query) => {
  return {
    type: googleAnalyticActionTypes.CLICK_CONSOLE_USER_SEARCH,
    label: query
  };
};

export const sendGroupInviteTrackingEvent = (platformDisplayName) => {
  return {
    type: googleAnalyticActionTypes.SEND_GROUP_INVITE,
    label: platformDisplayName
  };
};

export const acceptGroupInviteTrackingEvent = (platformDisplayName) => {
  return {
    type: googleAnalyticActionTypes.ACCEPT_GROUP_INVITE,
    label: platformDisplayName
  };
};

export const viewPlayerStatsTrackingEvent = (platformDisplayName) => {
  return {
    type: googleAnalyticActionTypes.VIEW_PLAYER_STATS,
    label: platformDisplayName
  };
};

export const viewTeamStatsTrackingEvent = (platformDisplayName) => {
  return {
    type: googleAnalyticActionTypes.VIEW_TEAM_STATS,
    label: platformDisplayName
  };
};

export const clickFeedbackTrackingEvent = (platformDisplayName) => {
  return {
    type: googleAnalyticActionTypes.CLICK_FEEDBACK,
    label: platformDisplayName
  };
};

export const updatePreferredHeroesTrackingEvent = (platformDisplayName) => {
  return {
    type: googleAnalyticActionTypes.UPDATE_PREFERRED_HEROES,
    label: platformDisplayName
  };
};

export const socketDisconnectTrackingEvent = (platformDisplayName) => {
  return {
    type: googleAnalyticActionTypes.SOCKET_DISCONNECT,
    label: platformDisplayName
  };
};
