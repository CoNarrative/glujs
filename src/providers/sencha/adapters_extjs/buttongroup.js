/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.provider.adapters.buttongroup = {
    defaultTypes:{
        items:'button'
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
    activeIndexBindings:{
        eventName:'select',
        eventConverter:function (button, idx) {
            return idx;
        }
    },
    selectedItemBindings:{
        eventName:'select',
        eventConverter:function (button, idx) {
            //if the button has a value, then use that, otherwise return the index
            return button.value || idx;
        }
    },
    //TODO: Rethink usage of activeItem as already taken...
    activeItemBindings:{
        eventName:'select',
        eventConverter:function (button, idx) {
            //if the button has a value, then use that, otherwise return the index
            return button.value || idx;
        }
    }

};