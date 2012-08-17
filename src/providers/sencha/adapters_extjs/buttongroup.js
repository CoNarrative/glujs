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
            config.defaults.toggleHandler = function(button){
                button.ownerCt.fireEvent('activeitemchanged', button.ownerCt,button,button.ownerCt.items.indexOf(button));
            };
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
        eventName:'activeitemchanged',
        eventConverter:function (group, button, idx) {
            //if the button has a value, then use that, otherwise return the index
            return button.value || idx;
        },
        setComponentProperty:function(value,oldvalue,options,control){
            var button = control.items.find(function(item){return value==item.value});
            button.toggle(true);
        }
    },

    afterCreate:function (control, viewmodel) {
        glu.provider.adapters.Container.prototype.afterCreate.apply(this, arguments);
        var me = this;
        if (control._bindingMap.activeItem){
            control.on('afterrender',function(){
                setTimeout(function(){
                    me.activeItemBindings.setComponentProperty(control.activeItem,null,null,control);
                },1);
            });
        }
    }

});