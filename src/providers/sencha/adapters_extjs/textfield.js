/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.textfield
 * @author Mike Gai
 * @extends glu.extjs.adapters.field
 *
 * A binder that adapts the textfield or its variants. Glu uses the keyup event in Ext 3.x to process the change, with a
 * 100 millisecond buffer to moderate the number of times the binding is updated.
 */
glu.regAdapter('textfield', {
    extend :'field',

    beforeCreate:function (config) {
        config.enableKeyEvents = true;
    },
    afterCreate:function (control, viewmodel) {
        if (glu.testMode) {
            control.addListener('keyup', function () {
                control.fireEvent('valuechanged', control);
            }, control);
            return;
        }
        //adds a buffer to all key events
        if (!control.delayedEvent) {
            control.delayedEvent = new Ext.util.DelayedTask(function () {
                control.fireEvent('valuechanged', control);
            });
        }
        control.addListener('keyup', function () {
            control.delayedEvent.delay(control.keyDelay || 100); //give some time for multiple keypresses...
        }, control);
    },
    valueBindings:{
        eventName:'valuechanged',
        eventConverter:function (control) {
            return control.getValue();
        }
    }
});