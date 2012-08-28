/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.List
 * An observable list of values or objects as a much lighter alternative to a store
 * The objects / values are not processed in any way (i.e. are not converted into Records or Models)
 * Notifications are raised when the list itself is manipulated.
 *
 */
glu.List = glu.extend(Object, {
    constructor:function (config) {
        config = config || {};
        glu.deepApply(this, config);
        this.length = 0;
        this._private = this._private || {};
        this._private.objs = [];
        new glu.GraphObservable({vm:this});
        config.items = config.items || config.data || [];
        for (var i = 0; i < config.items.length; i++) {
            var item = config.items[i];
            this.add(item, true);
        }
        delete this.items;
    },
    /**
     * Adds an item to the list
     * @param obj
     * @param silent
     */
    add:function (obj, silent) {
        this.insert(this.length,obj);
    },
    /**
     * Inserts an item at an ordinal position
     * @param index
     * @param obj
     */
    insert:function (index, obj) {
        if (obj.parentVM && obj.parentVM!==this.parentVM) {
            throw "View model already has a parent and needs to be removed from there first";
        }
        if (glu.isObject(obj) && obj.mtype ) {
            if (obj._private===undefined) {
                obj.ns = obj.ns || this.ns;
                obj.parentVM = this.parentVM;
                obj.parentList = this;
                obj = glu.model(obj);
            }
            obj.parentList = this;
            //            obj.referenceName = this.referenceName + '[x]';
            obj._ob.attach('parentVM');
            obj._ob.attach('rootVM')
        }
        this._private.objs.splice(index, 0, obj);
        this.length++;
        this.fireEvent('lengthchanged',this.length,this.length-1);
        this.fireEvent('added', obj, index);
    },
    /**
     * Removes an item by reference
     * @param Obj
     * @return {*}
     */
    remove:function (Obj) {
        return this.removeAt(this.indexOf(Obj));
    },
    /**
     * Removes an item by ordinal position
     * @param index
     * @return {*}
     */
    removeAt:function (index) {
        var obj = this.getAt(index);
        this._private.objs.splice(index, 1);
        this.length--;
        if (obj._ob) {
            //remove from observation graph...since it can only go child-> parent don't worry about other direction
            obj._ob.detach('parentVM');
            obj._ob.detach('rootVM');
        }
        this.fireEvent('removed', obj, index);
        if (index < this.activeIndex) {
            this.setActiveIndex(this.getActiveIndex() - 1);
        }
        this.fireEvent('lengthchanged',this.length,this.length+1);
        return obj;
    },
    /**
     * Removes all items
     */
    removeAll:function () {
        while (this.length > 0) {
            this.removeAt(0);
        }
    },

    /**
     * Returns the ordinal index of an item
     * @param obj
     * @return {Number}
     */
    indexOf:function (obj) {
        for (var i = 0; i < this._private.objs.length; i++) {
            if (obj === this._private.objs[i]) {
                return i;
            }
        }
        return -1;
    },

    /**
     * Whether or not the supplied item is in the container
     * @param Obj
     * @return {Boolean}
     */
    contains:function (Obj) {
        return this.indexOf(Obj) > -1;
    },
    /**
     * Fetches the item at a given ordinal position
     * @param index
     * @return {*}
     */
    getAt:function (index) {
        return this._private.objs[index];
    },
    /**
     * The total number of items in the container
     * @property {Number}
     */
    length : 0,
    /**
     * An alias for length()
     * @return {Number}
     */
    getCount:function () {
        return this._private.objs.length;
    },
    /**
     * Iterates through each item in the list and applies the function
     * @param operation
     * @param scope
     */
    foreach:function (operation, scope) {
        for (var i = 0; i < this.length; i++) {
            var item = this.getAt(i);
            var myScope = scope || item;
            operation.call(myScope, item, i);
        }
    },

    /**
     * Returns a single item using a custom finder
     * @param fn
     * @param scope
     * @return {*}
     */
    find:function (fn, scope) {
        for (var i = 0; i < this.length; i++) {
            var item = this.getAt(i);
            var myScope = scope || item;
            if (fn.call(myScope, item)) {
                return item;
            }
        }
    },

    on:function (eventName, handler, scope) {
        scope = scope || this;
        this._ob.on(eventName, handler, scope);
    },

    toArray:function(){
        return this._private.objs.slice();
    },
    fireEvent:function () {
        glu.log.info('List "' + this.referenceName + '" is firing event "' + arguments[0] + '""');
        this._ob.fireEvent.apply(this._ob, arguments);
    }
});

glu.mreg('list', glu.List);

glu.mreg('keytracking',{
    initMixin:function(){
        this.keyMap ={};
        this.idProperty = this.idProperty || 'id';
        //add initial keys since this is after constructor...
        for (var i=0;i<this._private.objs.length;i++){
            this.addKey(this._private.objs[i]);
        }
        this.on('added',this.addKey)
        this.on('removed',this.removeKey)
    },
    addKey:function(item, idx){
        var key=item[this.idProperty];
        if (key===undefined) return;
        this.keyMap[key] = item;
    },
    removeKey:function(item){
        var key=item[this.idProperty];
        if (key===undefined) return;
        delete this.keyMap[key];
    },
    containsKey:function(key){
        return this.keyMap[key]!==undefined;
    },
    getById:function(key){
        return this.keyMap[key];
    },
    removeAtKey:function(key){
        var item = this.keyMap[key];
        if (item==null) return;
        this.remove(item);
    }
})


glu.List.prototype.where = function(filter) {
    var f = [];
    for (var i = 0; i < this.length; i++) {
        var item = this.getAt(i);
        if (filter.call(this.parentVM, item)) f.push(item);
    }
    return f;
}

glu.List.prototype.count = function(filter) {
    return this.where(filter).length;
}

glu.List.prototype.any = function(filter) {
    return this.where(filter).length > 0;
}
