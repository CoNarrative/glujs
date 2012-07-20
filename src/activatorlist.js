/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.ViewmodelActivator
 * @extends glu.List
 * A dynamic activation list of sub-viewmodels that can be flipped through (to power a tab, card, wizard, selected item, etc.)
 *
 * Same as the List, but you specify a 'focusProperty' that will hold one of the items in the list (accessible as well through getActiveItem())
 *
 * It will make sure that any item specified in the focus property is a member of the list (throwing an error if it doesn't, though null is allowed).
 *
 * It will also manage changing the focus item automatically to the next one should the focus item be deleted (or setting to null if all items are removed).
 *
 * It will call enter() and exit()  (if defined) on the focus view model whenever that property is updated
 */
glu.ViewmodelActivator = glu.extend(glu.List, {
 /**
     * @cfg {String} focusProperty A property on the containing view model that will hold the currently "activated" or focused item.
     */

    constructor:function (config) {
        glu.ViewmodelActivator.superclass.constructor.call(this, config);
        this.activeIndex = this.activeIndex || 0;
        this.activeItem = this.getActiveItem();
        this.focusProperty = config.focusProperty || glu.symbol(config.referenceName).until('List') + 'WithFocus';
        this.focusPropertyType = config.focusPropertyType || 'viewmodel';
        var me = this;
        this.parentVM.on (this.focusProperty+'Changed', function(value){
            if (glu.isNumber(value)) {
                me.setActiveIndex(value);
            } else {
                me.setActiveItem(value);
            }
        });
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
        var obj = glu.ViewmodelActivator.superclass.removeAt.call(this, toRemove);
        if (toRemove === this.activeIndex) {
            this.setActiveIndex(this.getActiveIndex());
        }
        if (this.getActiveItem() == null) {
            //do nothing for now...
        }
		return obj;
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
            //TODO: Figure out what it means to set item to null when binding
            return;
        }
        if (this.activeItem.enter) {
            this.activeItem.enter();
        }
    },

    setActiveItem:function (item) {
        var idx = this.indexOf(item);
        if (idx == -1 && item!=null )
            throw ("You are attempting to pass in a view model that is not contained by the activator.");
        this.setActiveIndex(idx);
    }
});
glu.mreg('viewmodelactivator', glu.ViewmodelActivator);
glu.mreg('activatorlist', glu.ViewmodelActivator);
