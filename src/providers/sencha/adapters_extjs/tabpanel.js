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
            if (value===undefined || value===-1) {
                return; //nothing to do ... can't really "deselect" within ExtJS
            }
            if (value.mtype) {
                control._activeItemValueType = 'viewmodel';
                value = control.items.findIndexBy(function(card){return card._vm == value;});
                if (value==-1) throw new Error("Could not find a item in card layout bound to the view model passed to activeItem");
            }
            control._changeOriginatedFromModel = true;
            control.setActiveTab(value);
        },
        transformInitialValue : function (value, config, viewmodel){
            if (value.mtype) {
                if (value.parentList === undefined) {
                    throw new Error("Attempted to set an activeTab to a view model that is not in a list.  You should always set an activeTab in the init().");
                }
                config._activeItemValueType = 'viewmodel';
                config._activeIndex = value.parentList.indexOf(value);
                //This is never going to work anyway because ExtJS doesn't care about activeTab when there are no items
                //And we haven't put the items in yet
                return -1;
            }
            return value;
        },
        eventName:'tabchangerequest',
        eventConverter:function (control, panel, idx) {
            return control._activeItemValueType==='viewmodel'?panel._vm:idx;
        }
    },

    afterCreate: function (control, viewmodel){
        glu.provider.adapters.Panel.prototype.afterCreate.apply(this, arguments);
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
                control.fireEvent('tabchangerequest', control, newpanel, newIndex);
            });
            return false;
        }, this);

        if( control._activeIndex !== undefined ){
            control.on('render', function(tabpanel){
                tabpanel._changeOriginatedFromModel = true;
                tabpanel.setActiveTab(tabpanel._activeIndex);
            });
        }
    }
});
