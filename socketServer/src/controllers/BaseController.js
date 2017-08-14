const logger = require('winston');
const EventEmitter = require('eventemitter2').EventEmitter2;
const clientEvents = require('../socketEvents/clientEvents');

module.exports = class BaseController {

    constructor(config) {
        this.config = config;
        this.eventEmitter = new EventEmitter();
        this.socket = config.socket;
        this.token = this.socket.token;
        this.battleNetId = this.token.battleNetId;
        this.region = config.region;
        this.namespace = config.namespace;
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
        if (!this.socket._events || !this.socket._events[event]) {
            this.socket.on(event, (eventData) => {
                let data = {
                    'config': this.config,
                    eventData
                };

                this.eventEmitter.emitAsync(this._getBeforeEvent(event), data).then(() => {
                    return this.eventEmitter.emit(this._getOnEvent(event), data);
                }).then(() => {
                    return this.eventEmitter.emit(this._getAfterEvent(event), data);
                }).catch((error) => {
                    logger.error(`Error handling socket event [${event}] for user [${this.battleNetId}]: ${error}`);
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