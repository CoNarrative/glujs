/*
 * Copyright (C) 2013 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.segmentedbutton
 * @author Travis Barajas
 * @extends glu.extjs.adapters.container
 * The segmentedbutton adapter adds support for an activeButton binding.  Only works for when allowMultiple is false.
 *
*
 */
glu.regAdapter('segmentedbutton', {
    extend:'container',
    applyConventions:function (config, viewmodel) {
        Ext.applyIf(config, {
            text : glu.conventions.asLocaleKey(config.name),
            activeButton: glu.conventions.expression(config.name)
        });
        glu.provider.adapters.Container.prototype.applyConventions.apply(this, arguments);
    },
    beforeCreate:function (config, viewmodel) {
        glu.provider.adapters.Container.prototype.beforeCreate.apply(this, arguments);
        config.listeners = {
            toggle: function (segButton, button, isPressed, eOpts) {
                if(!isPressed) return //Don't care about the active button being depressed.
                segButton.fireEvent('activeitemchanged', segButton, button, isPressed);
            }
        }
    },
    activeButtonBindings:{
        setComponentProperty:function (value, oldValue, options, control) {
            //TODO:  Code a better way to ignore the UI event
            if(control.getPressedButtons()[0].config.value === value) return;

            console.log('about to set value '+value)
            var button = control._items.findBy(function (item) {
                if(item.config.value == value) return true;
            });

            control.setPressedButtons(button);
        },
        eventName:'activeitemchanged',
        eventConverter:function (control, button, isPressed) {
            return button.config.value
        }
    },
    afterCreate: function (control, viewmodel) {
        glu.provider.adapters.Container.prototype.afterCreate.apply(this, arguments);
        if (control.config.activeButton != null) {
            var button = control._items.findBy(function (item) {
                if(item.config.value == control.config.activeButton) return true;
            })
            control.setPressedButtons(button);
        }
    }
});