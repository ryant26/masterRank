const chai = require('chai');
const assert = chai.assert;
const randomString = require('randomstring');
const BaseController = require('../../../src/controllers/BaseController');
const EventEmitter = require('events');

describe('BaseController Tests', function() {
    let baseController;
    let socket;
    let token;

    beforeEach(function() {
        socket = new EventEmitter();
        token = {
            battleNetId: randomString.generate(),
            region: randomString.generate(),
            platform: 'pc'
        };
        baseController = new BaseController({socket, token});
    });

    describe('Before', function() {

        it('Should execute before on', function() {
            let socketEvent = randomString.generate();
            let beforeCalled = false;
            let onCalled = false;

            let beforePromise = new Promise((resovle) => {
                baseController.before(socketEvent, () => {
                    assert.isFalse(onCalled);
                    assert.isFalse(beforeCalled);
                    beforeCalled = true;
                    resovle();
                });
            });

            let onPromise = new Promise((resolve) => {
                baseController.on(socketEvent, () => {
                    assert.isTrue(beforeCalled);
                    assert.isFalse(onCalled);
                    onCalled = true;
                    resolve();
                });
            });

            socket.emit(socketEvent);

            return Promise.all([beforePromise, onPromise]);
        });

        it('Should execute before after', function() {
            let socketEvent = randomString.generate();
            let beforeCalled = false;
            let afterCalled = false;

            let beforePromise = new Promise((resovle) => {
                baseController.before(socketEvent, () => {
                    assert.isFalse(afterCalled);
                    beforeCalled = true;
                    resovle();
                });
            });

            let onPromise = new Promise((resolve) => {
                baseController.after(socketEvent, () => {
                    assert.isTrue(beforeCalled);
                    afterCalled = true;
                    resolve();
                });
            });

            socket.emit(socketEvent);

            return Promise.all([beforePromise, onPromise]);
        });

        it('Should accept multiple events with a single handler', function() {
            let socketEvent = randomString.generate();
            let socketEvent2 = randomString.generate();

            let event1Handled = false;
            let event2Handled = false;

            let beforePromise = new Promise((resovle) => {
                baseController.before([socketEvent, socketEvent2], () => {
                    if(!event1Handled) {
                        assert.isFalse(event2Handled);
                        event1Handled = true;
                    } else {
                        assert.isFalse(event2Handled);
                        event2Handled = true;
                        resovle();
                    }
                });
            });

            socket.emit(socketEvent);
            socket.emit(socketEvent2);

            return beforePromise;
        });

        it('Should accept multiple handlers with a single event', function() {
            let socketEvent = randomString.generate();

            let handler1Called = false;
            let handler2Called = false;

            let beforePromise = new Promise((resovle) => {
                baseController.before(socketEvent, () => {
                    assert.isFalse(handler1Called);
                    assert.isFalse(handler2Called);
                    handler1Called = true;
                }, () => {
                    assert.isTrue(handler1Called);
                    assert.isFalse(handler2Called);
                    handler2Called = true;
                    resovle();
                });
            });

            socket.emit(socketEvent);

            return beforePromise;
        });
    });

    describe('On', function() {

        it('Should execute before after', function() {
            let socketEvent = randomString.generate();
            let onCalled = false;
            let afterCalled = false;

            let beforePromise = new Promise((resovle) => {
                baseController.on(socketEvent, () => {
                    assert.isFalse(afterCalled);
                    onCalled = true;
                    resovle();
                });
            });

            let onPromise = new Promise((resolve) => {
                baseController.after(socketEvent, () => {
                    assert.isTrue(onCalled);
                    afterCalled = true;
                    resolve();
                });
            });

            socket.emit(socketEvent);

            return Promise.all([beforePromise, onPromise]);
        });

        it('Should accept multiple events with a single handler', function() {
            let socketEvent = randomString.generate();
            let socketEvent2 = randomString.generate();

            let event1Handled = false;
            let event2Handled = false;

            let beforePromise = new Promise((resovle) => {
                baseController.on([socketEvent, socketEvent2], () => {
                    if(!event1Handled) {
                        assert.isFalse(event2Handled);
                        event1Handled = true;
                    } else {
                        assert.isFalse(event2Handled);
                        event2Handled = true;
                        resovle();
                    }
                });
            });

            socket.emit(socketEvent);
            socket.emit(socketEvent2);

            return beforePromise;
        });

        it('Should accept multiple handlers with a single event', function() {
            let socketEvent = randomString.generate();

            let handler1Called = false;
            let handler2Called = false;

            let beforePromise = new Promise((resovle) => {
                baseController.on(socketEvent, () => {
                    assert.isFalse(handler1Called);
                    assert.isFalse(handler2Called);
                    handler1Called = true;
                }, () => {
                    assert.isTrue(handler1Called);
                    assert.isFalse(handler2Called);
                    handler2Called = true;
                    resovle();
                });
            });

            socket.emit(socketEvent);

            return beforePromise;
        });
    });

    describe('After', function() {

        it('Should accept multiple events with a single handler', function() {
            let socketEvent = randomString.generate();
            let socketEvent2 = randomString.generate();

            let event1Handled = false;
            let event2Handled = false;

            let beforePromise = new Promise((resovle) => {
                baseController.after([socketEvent, socketEvent2], () => {
                    if(!event1Handled) {
                        assert.isFalse(event2Handled);
                        event1Handled = true;
                    } else {
                        assert.isFalse(event2Handled);
                        event2Handled = true;
                        resovle();
                    }
                });
            });

            socket.emit(socketEvent);
            socket.emit(socketEvent2);

            return beforePromise;
        });

        it('Should accept multiple handlers with a single event', function() {
            let socketEvent = randomString.generate();

            let handler1Called = false;
            let handler2Called = false;

            let beforePromise = new Promise((resovle) => {
                baseController.after(socketEvent, () => {
                    assert.isFalse(handler1Called);
                    assert.isFalse(handler2Called);
                    handler1Called = true;
                }, () => {
                    assert.isTrue(handler1Called);
                    assert.isFalse(handler2Called);
                    handler2Called = true;
                    resovle();
                });
            });

            socket.emit(socketEvent);

            return beforePromise;
        });
    });
});