/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.fieldcontainer
 * @author Mike Gai
 * @extends glu.extjs.adapters.panel
 * A binder to the new, improved Ext 4.x compositefield
 */
glu.regAdapter('fieldcontainer', {
    extend : 'panel',

    applyConventions:function (config, viewmodel) {
        Ext.applyIf(config, {
            'value' : glu.conventions.expression(config.name),
            'valid' : glu.conventions.expression(config.name + 'IsValid', {optional:true})
        });
        glu.provider.adapters.Panel.apply(this, arguments);
    },

    /**
     * @cfg {String} fieldLabel
     *
     * The label that will be applied to this field if in the appropriate layout.
     *
     * Usually, it is best to make sure that this is a localization key and not an exact text literal
     *      fieldLabel: '~~firstName~~'
     * will look up the key 'firstName' in the localizer and replace with the appropriate text
     *
     * **Convention: ** &#126;&#126;*firstName*&#126;&#126;
     */
    itemsBindings:{
        custom:function (context) {
            glu.provider.itemsHelper.bindItems(context, true);
        }
    },
	
	beforeCollect: function(config){
		glu.provider.adapters.Panel.prototype.beforeCollect.apply(this, arguments);
		this.checkForEditors(config, {fieldLabel:'labelEl'});
	}
});