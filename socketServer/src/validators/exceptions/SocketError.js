module.exports = class SocketError extends Error {
    constructor(message, key, value) {
        super(message);
        this.metadata = {key, value};
    }
};