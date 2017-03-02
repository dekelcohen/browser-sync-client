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
    eventManager.addEvent(document.body, EVENT_NAME, exports.browserEvent(bs));
    bs.socket.on(EVENT_NAME, exports.socketEvent(bs, eventManager));
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

            // if (elem.type === "checkbox" || elem.type === "radio") {
            //     bs.utils.forceChange(elem);
            //     return;
            // }


            console.log('browserEvent - mousedown - before socket.emit')    
            bs.socket.emit(EVENT_NAME, bs.utils.getElementData(elem));

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
        console.log('socketEvent - mousedown')
        if (!bs.canSync(data, OPT_PATH) || bs.tabHidden) {
            return false;
        }

        console.log('socketEvent - mousedown - after canSync')

        var elem = bs.utils.getSingleElement(data.tagName, data.index);

        if (elem) {
            exports.canEmitEvents = false;
            //eventManager.triggerClick(elem);
        }
    };
};