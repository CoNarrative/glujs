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
///        debugger;
        glu.provider.adapters.Component.prototype.beforeCreate.apply(this, arguments);
        if (config.layout && config.layout.type === 'card') {
//            debugger;
            //control._activeIndex !== undefined
            if (config._bindingMap && config._bindingMap.activeItem !== undefined) {
                config.activeItem = -1;
                config.listeners = config.listeners || {};
                config.listeners = {
                    painted: {
                        fn: function () {
                            this.setActiveItem(0)
                        }
                    },
                    activeitemchange: {
                        fn: function (control) {

                        }
                    }
                }
            }
        }

    },
    afterCreate: function (control, vm) {
        glu.provider.adapters.Component.prototype.afterCreate.apply(this, arguments);
        var config = control.config;
        if (config.layout && config.layout.type === 'card') {
            if (config._bindingMap && config._bindingMap.activeItem !== undefined) {
//                control.setActiveItem(1)
            }
        }

    },
    activeItemBindings: {
        setComponentProperty: function (value, oldValue, options, control) {
            debugger;
            //TODO: added this check due to headless access.  if fails because layout is not rendered
            if (!control.getLayout() || !control.getLayout().setActiveItem) {
                return;
            }
            control.getLayout().setActiveItem(value);
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