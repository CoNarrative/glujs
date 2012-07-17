/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.regAdapter('tabpanel', {
    extend : 'panel',

    applyConventions:function (config, viewmodel) {
        var itemName = glu.string(config.name).until('List');
        Ext.applyIf(config, {
            activeTab:glu.conventions.expression(itemName + 'WithFocus', {optional:true})
        });
        glu.provider.adapters.Container.prototype.applyConventions.apply(this, arguments);
    },

    /**
     * Can be either the view model itself or its index
     */
    activeTabBindings : {
        storeValueInComponentAs : '_activeIndex',
        setComponentProperty:function (value, oldValue, options, control) {
            //debugger;
            if (value.mtype) {
                if (value.parentList === undefined) {
                    throw "Attempted to set an activeTab to a view model that is not in a list";
                }
                control._activeItemValueType = 'viewmodel';
                control._parentList = value.parentList;
                //look up index...
                value = value.parentList.indexOf(value);
            }
            control._changeOriginatedFromModel = true;
            control.setActiveTab(value);
        },
        transformInitialValue : function (value, config, viewmodel){
            if (value.mtype) {
                if (value.parentList === undefined) {
                    throw "Attempted to set an activeTab to a view model that is not in a list";
                }
                return value.parentList.indexOf(value);
            }
            return value;
        },
        eventName:'tabchangerequest',
        eventConverter:function (control, idx) {
            return control._activeItemValueType==='viewmodel'?control._parentList.getAt(idx):idx;
        }
    },

    afterCreate: function (control, viewmodel){
        //debugger;
        if (!control._bindingMap || control._bindingMap.activeTab===undefined) {
            return; //only instrument below if tracking active tab
        }
        control.valueSetTask = new Ext.util.DelayedTask(function () {});
        control.on('beforetabchange', function (tab, newpanel) {
            if (control._changeOriginatedFromModel) {
                delete control._changeOriginatedFromModel;
                return true;
            }
            var newIndex = tab.items.indexOf(newpanel);
            //a) set up a "request" and reject the change, so that the tab won't switch without passing through the view model
            control.valueSetTask.delay(1,function(){
                control.fireEvent('tabchangerequest', control, newIndex);
            });
            return false;
        }, this);
    }
});
