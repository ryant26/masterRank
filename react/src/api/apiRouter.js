const websocketPort = '3004';

export const getSocketApiBase = function(token) {
    let out;
    let hostname = window.location.hostname;

    if (hostname === 'localhost') {
        out = `${hostname}:${websocketPort}`;
    } else {
        out = `socket${hostname}`;
    }

    return `${out}/${token.region}/${token.platform}`;
};
