/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.regAdapter('toolbar', {
    extend : 'container',
    defaultTypes : {
        items : 'button'
    },
    itemsBindings:{
        custom:function (context) {
//            context.control.itemTemplate = context.control.itemTemplate || function (item) {
//                var key = item.get('name') || item.get('itemId') || item.get('value');
//                return {
//                    xtype:'button',
//                    text:glu.conventions.localizeStart + key + glu.conventions.localizeEnd,
//                    value:key
//                }
//            };
            glu.provider.itemsHelper.bindItems(context, true);
        }
    }
});