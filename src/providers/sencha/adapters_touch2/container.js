/*
 * Copyright (c) 2012 CoNarrative
 */
glu.regAdapter('container', {
    extend: 'component',
    applyConventions: function (config, viewmodel) {
        Ext.applyIf(config, {
            items: glu.conventions.expression(config.name)
        });
        glu.provider.adapters.Component.prototype.applyConventions.apply(this, arguments);
    },
    isChildArray: function (propName, value) {
        return propName === 'items' || propName === 'dockedItems';
    },
    beforeCollect: function (control, viewmodel) {
        glu.provider.adapters.Component.prototype.beforeCollect.apply(this, arguments);
    },
    beforeCreate: function (config, vm) {
        glu.provider.adapters.Component.prototype.beforeCreate.apply(this, arguments);
        if (config.layout && config.layout.type === 'card') {
            if (config._bindingMap && config._bindingMap.activeItem !== undefined) {
                config.activeItem = 0;   //TODO:  Hack.  Figure out why this is needed.
            }
        }
    },
    afterbinding: function (control, vm) {
        var activeItem;
        var acitveItemBinding;
        var config = control.config;
        if (config.layout && config.layout.type === 'card') {
            if (config._bindingMap && config._bindingMap.activeItem !== undefined) {
                for (var i = 0; i < config._bindings.length; i++) {
                    if (config._bindings[i].controlPropName === 'activeItem') {
                        acitveItemBinding = config._bindings[i];
                        break;
                    }
                }

                activeItem = vm.get(acitveItemBinding.modelPropName);
                var activeItemIndex = control.items.findIndexBy(function (item) {
                    return item._vm == activeItem;
                });
                control.setActiveItem(-1);
                control.setActiveItem(activeItemIndex);
            }
        }

    },
    afterCreate: function (control, vm) {
        glu.provider.adapters.Component.prototype.afterCreate.apply(this, arguments);
    },
    activeItemBindings: {
        eventName: 'activeitemchangerequest',
        eventConverter: function (control, newItem, idx) {
            return control._activeItemValueType === 'viewmodel' ? panel._vm : idx;
        },
        storeValueInComponentAs: '_activeIndex',
        setComponentProperty: function (value, oldValue, options, control) {
            if (value === undefined || value === -1) {
                return; //nothing to do ... can't really "deselect" within ExtJS
            }
            if (value.mtype) {
                control._activeItemValueType = 'viewmodel';
                value = control.items.findIndexBy(function (card) {
                    return card._vm == value;
                });
                if (value == -1) throw "Could not find a item in card layout bound to the view model passed to activeItem";
            }
            control._changeOriginatedFromModel = true;
            control.setActiveItem(value);
        }
    },
    itemsBindings: {
        custom: function (context) {

            if (context.control.getLayout().config.type != 'card') {
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