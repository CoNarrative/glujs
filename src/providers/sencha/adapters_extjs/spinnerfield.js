/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.spinnerfield
 * @author Mike Gai
 * @extends glu.extjs.adapters.field
 *
 * A binder that adapts spinners (like the Number field)
 */
glu.regAdapter('spinnerfield', {
    extend :'field',
    beforeCreate:function (config) {
        config.enableKeyEvents = true;
    },
    afterCreate:function (control, viewmodel) {
        glu.provider.adapters.Field.prototype.afterCreate.apply(this, arguments);
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
        control.addListener('spin', function(){
            control.delayedEvent.delay(control.keyDelay || 100);
        })
    },
    initAdapter : function(){
        this.valueBindings = glu.deepApplyIf({eventName : 'valuechanged'},this.valueBindings);
    }
});

