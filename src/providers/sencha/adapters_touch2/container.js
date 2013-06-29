/*
 * Copyright (c) 2012 CoNarrative
 */
glu.regAdapter('container', {
    extend:'component',
    applyConventions:function (config, viewmodel) {
        Ext.applyIf(config, {
            items:glu.conventions.expression(config.name)
        });
        glu.provider.adapters.Component.prototype.applyConventions.apply(this, arguments);
    },
    isChildArray:function (propName, value) {
        return propName === 'items' || propName === 'dockedItems';
    },
    beforeCollect:function (control, viewmodel) {
        glu.provider.adapters.Component.prototype.beforeCollect.apply(this, arguments);
    },
    beforeCreate:function (config) {
        glu.provider.adapters.Component.prototype.beforeCreate.apply(this, arguments);
        config.listeners = config.listeners || {};
        config.listeners = {
            render: {
                fn: function() {
                  debugger;
                },
                element: 'element'
            }
        }
    },
    afterCreate:function (control, viewmodel) {
        glu.provider.adapters.Component.prototype.afterCreate.apply(this, arguments);
    },
    activeItemBindings : {
        eventName:'activeitemchangerequest',
        eventConverter:function (control, idx, item) {
            return control._activeItemValueType==='viewmodel'?item._vm:idx;
        },
        storeValueInComponentAs : '_activeIndex',
        setComponentProperty:function (value, oldValue, options, control) {
            if (value===undefined || value===-1) {
                return; //nothing to do ... can't really "deselect" card/tab within ExtJS
            }
            if (value.mtype) {
                control._activeItemValueType = 'viewmodel';
                value = control.items.findIndexBy(function(card){return card._vm == value;});
                if (value==-1) throw "Could not find a item in card layout bound to the view model passed to activeItem";
            }
            var oldItem = oldValue==-1?null : control.items.getAt(oldValue);
            control._changeOriginatedFromModel = true;
            if( control.getLayout().type == 'card')
                control.getLayout().setActiveItem(value);
            else
                control.fireEvent('activeitemchanged', control, control.items.getAt(value), oldItem);
        }
//        ,
//        transformInitialValue : function (value, config, viewmodel){
//            if (value.mtype) {
//                if (value.parentList === undefined) {
//                    throw "Attempted to set an activeTab to a view model that is not in a list.  You should always set the activeItem in the init()";
//                }
//                config._activeItemValueType = 'viewmodel';
//                config._activeIndex = value.parentList.indexOf(value);
//                //This is never going to work anyway because ExtJS doesn't care about activeTab when there are no items
//                //And we haven't put the items in yet
//                return -1;
//            }
//            return value;
//        }
    },
//    activeItemBindings:{
//        setComponentProperty:function (value, oldValue, options, control) {
//
//            //TODO: added this check due to headless access.  if fails because layout is not rendered
//            if (!control.getLayout() || !control.getLayout().setActiveItem) {
//                return;
//            }
//            control.getLayout().setActiveItem(value);
//        }
//    },
    itemsBindings:{
        custom:function (context) {
            if (context.control._layout != 'card') {
                //do regular bindings
                glu.provider.itemsHelper.bindItems(context, false);
                return;
            }

            var activator = context.viewmodel.get(context.binding.modelPropName);
            var cardPanel = context.control;

            glu.provider.itemsHelper.bindItems(context);
        }
    }
});