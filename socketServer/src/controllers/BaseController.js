const logger = require('winston');
const EventEmitter = require('events');

module.exports = class BaseController {

    constructor(config) {
        this.config = config;
        this.eventEmitter = new EventEmitter();
        this.socket = config.socket;
        this.token = this.socket.token;
        this.battleNetId = this.token.battleNetId;
        this.region = config.region;
        this.namespace = config.namespace;
        this.groupId;
    }

    getBeforeEvent(event) {
        return `before.${event}`;
    }

    getOnEvent(event) {
        return `on.${event}`;
    }

    getAfterEvent(event) {
        return `after.${event}`;
    }

    addSocketHandler(event) {
        if (!this.socket._events || !this.socket._events[event]) {
            this.socket.on(event, (eventData) => {
                let data = {
                    'config': this.config,
                    eventData
                };

                try {
                    this.eventEmitter.emit(this.getBeforeEvent(event), data);
                    this.eventEmitter.emit(this.getOnEvent(event), data);
                    this.eventEmitter.emit(this.getAfterEvent(event), data);
                } catch (err) {
                    logger.error(`There was an error handling event ${event}: ${err}`);
                }
            });
        }
    }

    before(events, ...handlers) {
        this._addEventHandler(events, this.getBeforeEvent, ...handlers);
    }

    on(events, ...handlers) {
        this._addEventHandler(events, this.getOnEvent, ...handlers);
    }

    after(events, ...handlers) {
        this._addEventHandler(events, this.getAfterEvent, ...handlers);
    }

    _addEventHandler(socketEvents, controllerEventConverter, ...handlers) {
        if (Array.isArray(socketEvents)) {
            socketEvents.forEach((event) => {
                this.addSocketHandler(event);
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
            this.addSocketHandler(socketEvents);
            handlers.forEach((handler) => {
                this.eventEmitter.on(controllerEventConverter(socketEvents), handler);
            });
        }
    }
};