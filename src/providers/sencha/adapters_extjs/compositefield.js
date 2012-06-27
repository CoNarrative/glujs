/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.compositefield
 * @author Mike Gai
 * @extends glu.extjs.adapters.container
 * A basic adapter for a compositefield (see also {@link glu.extjs.adapters.fieldcontainer}).
 *
 */

glu.regAdapter('compositefield', {
    extend : 'field',
    valueBindings:{
        eventName:'change',
        eventConverter:function (control) {
            return control.getValue();
        }
    },
    afterCreate:function (control, viewmodel) {
        //ExtJS 3.2 Does not automatically initialize sub-items in initComponent so we do it here
        if (control.items.get === undefined) {
            for (var i = 0; i < control.items.length; i++) {
                control.items[i] = Ext.create(control.items[i]);
            }
        }
    },
    itemsBindings:{
        custom:function (context) {
            glu.provider.itemsHelper.bindItems(context, true);
        }
    },
    isChildArray : function(propName, value){
        return propName==='items';
    }
});