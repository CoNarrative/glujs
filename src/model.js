/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.Model = glu.extend(Object, {
    constructor:function (config) {
        glu.Model.superclass.constructor.call(this);
        glu.apply(this, config);
        this._private = this._private || {};
        this._private.data = {};

    },
    get:function (propName) {
        return this[propName];
        //return this._private.data[propName];
    },
    set:function (propName, value) {
        this.setRaw(propName, value);
    },
    setRaw:function (propName, value) {
        var oldValue = this.get(propName);
        if (oldValue === value) {
            return; //do nothing if it's the same thing.
        }
        this._private.data[propName] = value;
        this[propName] = value; //set locally for now too...
        this.fireEvent(propName + 'Changed', value, oldValue, {
            modelPropName:propName
        });
        this.fireEvent('changed', value, oldValue, {
            modelPropName:propName
        });

    }
});

glu.mreg('model', glu.Model);
