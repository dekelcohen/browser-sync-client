"use strict";

/**
 * This is the plugin for syncing clicks between browsers
 * @type {string}
 */
var EVENT_NAME  = "mousedown";
var OPT_PATH    = "ghostMode.mouse";
exports.canEmitEvents = true;

/**
 * @param {BrowserSync} bs
 * @param eventManager
 */
exports.init = function (bs, eventManager) {
    console.log('init - mousedown')
    eventManager.addEvent(document.body, 'mousedown', exports.browserEvent(bs));
    eventManager.addEvent(document.body, 'mouseup', exports.browserEvent(bs));
    bs.socket.on('mousedown', exports.socketEvent(bs, eventManager));
    bs.socket.on('mouseup', exports.socketEvent(bs, eventManager));
};

/**
 * Uses event delegation to determine the clicked element
 * @param {BrowserSync} bs
 * @returns {Function}
 */
exports.browserEvent = function (bs) {

    return function (event) {        
        if (exports.canEmitEvents) {

            var elem = event.target || event.srcElement;

            console.log('browserEvent - before socket.emit: event.type=' + event.type)    
            var data = bs.utils.getElementData(elem);
            data.type = event.type;
            bs.socket.emit(event.type, data);

        } else {
            exports.canEmitEvents = true;
        }
    };
};

/**
 * @param {BrowserSync} bs
 * @param {manager} eventManager
 * @returns {Function}
 */
exports.socketEvent = function (bs, eventManager) {

    return function (data) {        
        if (!bs.canSync(data, OPT_PATH) || bs.tabHidden) {
            return false;
        }

        console.log('socketEvent - type='  + data.type)

        var elem = bs.utils.getSingleElement(data.tagName, data.index);

        if (elem) {
            exports.canEmitEvents = false;
            eventManager.triggerClick(elem, data.type);
        }
    };
};