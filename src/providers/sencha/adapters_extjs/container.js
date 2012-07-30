/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.container
 * @extends glu.extjs.adapters.component
 */

/**
 * @cfg {Array/glu.List/glu.ActivatorList/Ext.data.Store} items
 * *one-way binding.*
 * This indicates that the items collection under this control is entirely bound and controlled by an array, List, or
 * Store within the view model. The items can be Records, Models, or Viewmodels.
 * As items are removed or added, they will be rendered appropriately through a defined itemTemplate (for Models
 * and Viewmodels when an itemTemplate is defined)
 * or through a matching view (for Viewmodels).
 * The items will honor their parent default xtype unless overriden.
 *
 * Since there is a collapsed tool available to the panel, we will support two-way binding in the future.
 *
 * **Convention:** @{*item*List}
 */
glu.regAdapter('container',{
    extend : 'component',
    applyConventions:function (config, viewmodel) {
        Ext.applyIf(config, {
            items : glu.conventions.expression(config.name)
        });
        glu.provider.adapters.Component.prototype.applyConventions.apply(this, arguments);
    },
    beforeCollect:function(){
        glu.provider.adapters.Component.prototype.beforeCollect.apply(this, arguments);
        //do nothing
    },
    isChildArray : function(propName, value){
        return propName==='editors' || propName==='items';
    },
	itemsBindings : {
        custom : function(context) {
            glu.provider.itemsHelper.bindItems(context);
        }
    }
});