/*
 * Copyright (C) 2012 by CoNarrative
 */
/*
 * @class glu.Observable
 * A very simple observer pattern implementation
 */

glu.Observable = glu.extend(Object, {
    constructor : function(){
        this._ob = this._ob || {};
        this._ob.events = {};
    },
    fireEvent:function () {
        var name = arguments[0].toLowerCase();
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        if (!this._ob.events.hasOwnProperty(name)) {
            this._ob.events[name] = {listeners:[]}
        }
        var evt = this._ob.events[name];
        var cullList = [];
        for (var i = 0; i < evt.listeners.length; i++) {
            var listener = evt.listeners[i];
            var myVeto = listener.fn.apply(listener.scope, args);
            if (myVeto === true) {
                return false;
            }
            if (myVeto ==='discard'){
                cullList.unshift(i);
            }
        }
        //cull dead observers...
        for (var i=0;i<cullList.length;i++){
            evt.listeners.splice(cullList[i],1);
        }
        return true;
    },
    on:function (name, callback, scope) {
        name = name.toLowerCase();
        if (!this._ob.events.hasOwnProperty(name)) {
            this._ob.events[name] = {listeners:[]}
        }
        var evt = this._ob.events[name];
        evt.listeners.push({fn:callback, scope:scope || glu});
    }
});

glu.observer = new glu.Observable();
glu.on = function(){
    this.observer.on.apply(this.observer,arguments);
}
glu.fireEvent = function(){
    this.observer.fireEvent.apply(this.observer,arguments);
}
glu.clearPlugins = function () {
    glu.events = {};
};

