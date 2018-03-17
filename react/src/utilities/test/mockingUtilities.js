import 'isomorphic-fetch';

import { users } from '../../resources/users';

const mockSocket = require('socket-io-mock');

export const getMockSocket = () => {
    let websocket = new mockSocket();
    websocket.addHero = jest.fn();
    websocket.removeHero = jest.fn();
    websocket.createGroup = jest.fn();
    websocket.groupInviteSend = jest.fn();
    websocket.groupLeave = jest.fn();
    websocket.groupInviteAccept = jest.fn();
    websocket.groupInviteCancel = jest.fn();
    websocket.groupInviteDecline = jest.fn();
    return websocket;
};

export const mockGetState = (state={}) => {
    const getState = jest.fn().mockImplementation(() => {
        return state;
    });

    return getState;
};

export const mockLocalStorage = () => {
    window.localStorage = {
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
    };
};

export const mockLocation = () => {
    window.location.assign = jest.fn();
};

export const getMockResponse = (status, statusText, jsonObj) => {
    return new Response(JSON.stringify(jsonObj), {
        status: status,
        statusText: statusText,
        headers: {
            'Content-type': 'application/json'
        }
    });
};

export const generateMockUser = (
    platformDisplayName= users[0].platformDisplayName,
    region= users[0].region,
    platform= users[0].platform) => {
        return {
            platformDisplayName,
            region,
            platform
        };
};

export const generateMockHero = (heroName='hero', platformDisplayName=users[0].platformDisplayName, preference=1) => {
    return {platformDisplayName, heroName, preference};
};