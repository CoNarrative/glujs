/*
* Copyright (c) 2012 CoNarrative
*/

/* DOCS DISABLED FOR NOW
 * @class glu.GraphObservable
 * An observer pattern that supports the notion of object graph connectivity, so that when items are
 * swapped into the graph they automatically detach/attach in the appropriate chains
 * @type {*}
 */
glu.GraphObservable = Ext.extend(Ext.emptyFn, {
    constructor:function (config) {
        glu.apply(this, config);
        this.node = this.node || this.vm || this;
        this.node._ob = this;
        glu.apply(this, {

            edges:{

            },
            events:{ //events found

            }

        })
    },

    on:function (path, fn, scope) {
        var tokens = path.split('.');
        scope = scope || this.node;
        this.propagateRequest({
            id:Ext.id(),
            remainder:tokens,
            origin:{
                fn:fn,
                scope:scope
            }
        });
    },

    fireEvent:function () {
        var name = arguments[0].toLowerCase();
        var evt = this.events[name];
        if (!evt) return;
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        var cullList = [];
        for (var key in evt.listeners) {
            var listener = evt.listeners[key];
            var myVeto = listener.origin.fn.apply(listener.origin.scope, args);
            if (myVeto === true) {
                return false;
            }
            if (myVeto === 'discard') {
                cullList.push(key);
            }
        }
        //cull dead observers...
        for (var key in cullList) {
            delete evt.listeners[key];
        }
        return true;
    },

    /**
     * Process an observation request from 'outside'. The request is the original of the 'donors'
     * Assumes object already exists
     * @param request
     * @private
     */
    propagateRequest:function (request) {
        if (request.remainder.length == 1) {
            //Found the terminus - the eventer
            var evtName = request.remainder[0].toLowerCase();
            this.events[evtName] = this.events[evtName] || {listenersCount:0, listeners:{}};
            var evt = this.events[evtName];
            if (!evt.listeners[request.id]) {
                evt.listeners[request.id] = {
                    id:request.id,
                    origin:request.origin
                };
                evt.listenersCount++;
            }
            return;
        }
        //otherwise, add as something to seek
        var myRequest = {
            id:request.id,
            remainder:request.remainder.slice(1),
            origin:request.origin
        };
        var nextEdge = request.remainder[0];
        this.edges[nextEdge] = this.edges[nextEdge] || {};
        this.edges[nextEdge][myRequest.id] = myRequest;
        var edgeVM = this.node[nextEdge];
        if (edgeVM && edgeVM._ob) {
            edgeVM._ob.propagateRequest(myRequest);
        } else {
            //TODO: If edge is array, stop there and change to just watch it instead...
//            if (edgeVM && edgeVM._ob === undefined && edgeVM.mtype) {
//                debugger;
//            }
        }
    },

    propagateRemoval:function (request) {
        if (request.remainder.length == 1) {
            //Found the terminus - the eventer -- now remove
            var evtName = request.remainder[0].toLowerCase();
            var evt = this.events[evtName];
            if (!evt || !evt.listeners[request.id]) {
                return;
            }
            delete evt.listeners[request.id];
            evt.listenersCount--;
            return;
        }
        //otherwise, add as something to seek
        var myRequest = {
            id:request.id,
            remainder:request.remainder.slice(1)
        };
        var nextEdge = request.remainder[0];
        var edge = this.edges[nextEdge];
        if (!edge) {
            return;
        }
        delete edge[myRequest.id];
        var edgeVM = this.node[nextEdge];
        if (edgeVM && edgeVM._ob) {
            edgeVM._ob.propagateRemoval(myRequest);
        }
    },
    /**
     * Walks through (already associated) graph node and propagates blocked edges
     * @param forwardRef
     * @param other
     * @param backRef
     * @private
     */
    attach:function (forwardRefName, other, backRefName) {
        other = other || this.node[forwardRefName];
        this.node[forwardRefName] = other;
        this.attachOneWay(forwardRefName);
        if (backRefName) {
            other[backRefName] = this.node;
            var other = this.node[forwardRefName];
            if (!other._ob) return;
            other._ob.attachOneWay(backRefName);
        }
    },

    detach:function (forwardRefName, backRefName) {
        var other = this.node[forwardRefName];
        this.detachOneWay(forwardRefName);
        if (backRefName) {
            other[backRefName] = null;
            if (!other._ob) return;
            other._ob.detachOneWay(backRefName);
        }
    },

    attachOneWay:function (refName) {
        var edges = this.edges [refName];
        if (edges) {
            var other = this.node[refName];
            if (!other || !other._ob) return;
            for (var requestId in edges) {
                var request = edges[requestId];
                other._ob.propagateRequest(request);
            }
        }
    },

    detachOneWay:function (refName) {
        var edges = this.edges [refName];
        if (edges) {
            var other = this.node[refName];
            if (!other || !other._ob) return;
            for (var requestId in edges) {
                var request = edges[requestId];
                other._ob.propagateRemoval(request);
            }
        }
    }

});