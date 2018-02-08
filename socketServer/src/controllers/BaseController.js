const logger = require('../services/logger').sysLogger;
const EventEmitter = require('eventemitter2').EventEmitter2;
const clientEvents = require('../socketEvents/clientEvents');
const serverEvents = require('../socketEvents/serverEvents');
const RateLimiter = require('limiter').RateLimiter;


module.exports = class BaseController {

    constructor(config) {
        this.config = config;
        this.eventEmitter = new EventEmitter();
        this.socket = config.socket;
        this.namespace = config.namespace;
        this.token = config.token || {};
        this._socketEvents = {};
        this.limiter = new RateLimiter(25, 'minute');
    }

    /**
     * Adds "before" handler(s) to the passed events
     * @param {String || []} events - Array of events or single event string
     * @param handlers - handler functions
     */
    before(events, ...handlers) {
        this._addEventHandler(events, this._getBeforeEvent, ...handlers);
    }

    /**
     * Adds "on" handler(s) to the passed events
     * @param {String || []} events - Array of events or single event string
     * @param handlers - handler functions
     */
    on(events, ...handlers) {
        this._addEventHandler(events, this._getOnEvent, ...handlers);
    }

    /**
     * Adds "after" handler(s) to the passed events
     * @param {String || []} events - Array of events or single event string
     * @param handlers - handler functions
     */
    after(events, ...handlers) {
        this._addEventHandler(events, this._getAfterEvent, ...handlers);
    }

    /**
     * Convert passed event name to "before" event
     * @param event
     * @returns {string}
     * @private
     */
    _getBeforeEvent(event) {
        return `before.${event}`;
    }

    /**
     * Convert passed event name to "on" event
     * @param event
     * @returns {string}
     * @private
     */
    _getOnEvent(event) {
        return `on.${event}`;
    }

    /**
     * Convert passed event to "after" event
     * @param event
     * @returns {string}
     * @private
     */
    _getAfterEvent(event) {
        return `after.${event}`;
    }

    /**
     * Adds a handler to the controller socket for the passed event.
     * @param event
     * @private
     */
    _addSocketHandler(event) {
        if (!this._socketEvents[event]) {
            this._socketEvents[event] = true;
            this.socket.on(event, (eventData) => {
                let data = {
                    'config': this.config,
                    eventData
                };

                if(event !== serverEvents.disconnect && !this.limiter.tryRemoveTokens(1)) {
                    this.socket.disconnect();
                    return;
                }

                this.eventEmitter.emitAsync(this._getBeforeEvent(event), data).then(() => {
                    return this.eventEmitter.emitAsync(this._getOnEvent(event), data);
                }).then(() => {
                    return this.eventEmitter.emitAsync(this._getAfterEvent(event), data);
                }).catch((error) => {
                    logger.error(`Error handling socket event [${event}] for user [${this.token.platformDisplayName}]: ${error}`);
                    if (clientEvents.error[event]) {
                        let errorInfo = {
                            err: error.message
                        };

                        if(error.metadata) {
                            errorInfo[error.metadata.key] = error.metadata.value;
                        }

                        this.socket.emit(clientEvents.error[event], errorInfo);
                    }
                });
            });
        }
    }

    /**
     * Private function to map eventemitter handlers to socket events
     * @param socketEvents
     * @param controllerEventConverter
     * @param handlers
     * @private
     */
    _addEventHandler(socketEvents, controllerEventConverter, ...handlers) {
        if (Array.isArray(socketEvents)) {
            socketEvents.forEach((event) => {
                this._addSocketHandler(event);
            });

            let controllerEvents = socketEvents.map((event) => {
                return controllerEventConverter(event);
            });

            controllerEvents.forEach((event) => {
                handlers.forEach((handler) => {
                    this.eventEmitter.on(event, handler);
                });
            });

        } else {
            this._addSocketHandler(socketEvents);
            handlers.forEach((handler) => {
                this.eventEmitter.on(controllerEventConverter(socketEvents), handler);
            });
        }
    }
};