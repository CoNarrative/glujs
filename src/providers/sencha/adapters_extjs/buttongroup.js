/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.regAdapter('buttongroup', {
    extend : 'container',
    defaultTypes:{
        items:'button'
    },
    beforeCollect:function(config){
        glu.provider.adapters.Container.prototype.beforeCollect.apply(this, arguments);
        //add in default item template???
        if (config.activeItem != null) {
            //convert to toggle button group
            config.defaults = config.defaults || {};
            config.defaults.enableToggle = true;
            config.defaults.toggleGroup = Ext.id();
            config.toggleHandler = function(){};
        }
    },
    itemsBindings:{
        custom:function (context) {
            context.control.itemTemplate = context.control.itemTemplate || function (item) {
                var key = item.itemId || item.name || item.value || item.id;
                return {
                    xtype:'button',
                    text:glu.conventions.localizeStart + key + glu.conventions.localizeEnd,
                    value:key
                }
            };
            glu.provider.itemsHelper.bindItems(context, true);
        }
    },
    activeItemBindings:{
        eventName:'select',
        eventConverter:function (button, idx) {
            //if the button has a value, then use that, otherwise return the index
            return button.value || idx;
        }
    },

    afterCreate:function (control, viewmodel) {
        glu.provider.adapters.Container.prototype.afterCreate.apply(this, arguments);
    }

});