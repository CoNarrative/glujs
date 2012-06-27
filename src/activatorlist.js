/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.ViewmodelActivator
 * @extends glu.List
 * A dynamic activation list of sub-viewmodels that can be flipped through (to back a tab, card, wizard, etc.)
 * Constructs the subviewmodels as necessary (immediately when added)
 * Calls enter/exit and honors exit veto
 * Surfaces 'on' events across all view models if you want to register for events on any current acive.
 */
glu.ViewmodelActivator = glu.extend(glu.List, {

    constructor:function (config) {
        glu.ViewmodelActivator.superclass.constructor.call(this, config);
        this.activeIndex = this.activeIndex || 0;
        this._private.data = {};
        this.activeItem = this.getActiveItem();
    },
    init:function () {
        this.foreach(function (submodel) {
            submodel.init();
        }, this)
    },

    getActiveItem:function () {
        return this.getAt(this.getActiveIndex());
    },

    removeAt:function (toRemove) {
        if (toRemove === this.activeIndex) {
            if (toRemove === this.length - 1) { //it's the last one
                this.setActiveIndex(toRemove - 1);
            }
        }
        glu.ViewmodelActivator.superclass.removeAt.call(this, toRemove);
        if (toRemove === this.activeIndex) {
            this.setActiveIndex(this.getActiveIndex());
            this.fireEvent('activeindexchanged', this.getActiveIndex());
        }

        if (this.getActiveItem()==null) {
            debugger;
        }
    },
    onActiveItem:function (eventName, handler, scope) {
        glu.log.info('Registering handler on proxy, not actual view model');
        scope = scope || this;
        this._private.observable.on(eventName, handler, scope);
    },
    getActiveIndex:function () {
        return this.get('activeIndex');
    },
    setActiveIndex:function (idx) {
        if (this._private.activeModel != null) {
            this._private.activeModel.exit();
        }
        this.activeItem = this.getActiveItem();
        this.set('activeIndex', idx);
        if (this.getActiveItem()==null) {
            debugger;
        }
        //this._private.activeModel.enter();
    },
    setActiveItem:function (item) {
        var idx = this.indexOf(item);
        if (idx == -1)
            throw ("You are attempting to pass in a view model that is not contained by the activator.");
        this.setActiveIndex(this.indexOf(item));
    },

    /*
     * Nothing changed from base List event except wording of log entry
     */
    fireEvent:function () {
        glu.log.info('ViewmodelActivator "' + this.referenceName + '" is firing event "' + arguments[0] + '""');
        this._private.observable.fireEvent.apply(this._private.observable, arguments);
    },

    get:function (propName) {
        return this[propName];
        //return this._private.data[propName];
    },
    set:function (propName, value) {
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
glu.mreg('viewmodelactivator', glu.ViewmodelActivator);
glu.mreg('activatorlist', glu.ViewmodelActivator);
