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
        this.activeItem = this.getActiveItem();
        this.focusProperty = config.focusProperty || glu.symbol(config.referenceName).until('List') + 'WithFocus';
        this.focusPropertyType = config.focusPropertyType || 'viewmodel';
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
        }
        if (this.getActiveItem() == null) {
            //do nothing for now...
        }
    },

    getActiveIndex:function () {
        return this.activeIndex;
    },

    setActiveIndex:function (idx) {
        if (this.activeItem && this.activeItem.exit) {
            this.activeItem.exit();
        }

        this.activeIndex=idx;
        this.activeItem = this.getActiveItem();

        //push into focus property
        this.parentVM.set(this.focusProperty, this.focusPropertyType==='viewmodel' ? this.activeItem : this.activeIndex);

        if (this.activeItem == null) {
            debugger;
            return;
        }
        if (this.activeItem.enter) {
            this.activeItem.enter();
        }
    },

    setActiveItem:function (item) {
        var idx = this.indexOf(item);
        if (idx == -1)
            throw ("You are attempting to pass in a view model that is not contained by the activator.");
        this.setActiveIndex(this.indexOf(item));
    }
});
glu.mreg('viewmodelactivator', glu.ViewmodelActivator);
glu.mreg('activatorlist', glu.ViewmodelActivator);
