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

    beforeCollect:function (config) {
        glu.provider.adapters.Field.prototype.beforeCollect.apply(this, arguments);
        config.enableKeyEvents = true;
    },

    /**
     * @cfg {Function} enterKeyHandler
     * A special GluJS convenience shortcut that handles the pressing of the "Enter" key when in the field
     */
    afterCreate:function (control, viewmodel) {
        glu.provider.adapters.Field.prototype.afterCreate.apply(this, arguments);
        if (glu.testMode) {
            control.addListener('keyup', function () {
                control.fireEvent('textchanged', control);
            }, control);
            return;
        }
        //adds a buffer to all key events
        if (!control.delayedEvent) {
            control.delayedEvent = new Ext.util.DelayedTask(function () {
                control.fireEvent('textchanged', control);
            });
        }
        control.addListener('keyup', function (t,e,o) {
            control.delayedEvent.delay(control.keyDelay || 100); //give some time for multiple keypresses...
        }, control);

        if (control.enterKeyHandler) {
            //special gluJS helper handler
            control.on('specialkey', function(f,e){
                if (e.getKey() == e.ENTER) {
                    control.fireEvent('textchanged',control); //force most recent
                    control.enterKeyHandler();
                }
            },null,{delay:110});
        }
    },
    initAdapter:function(){
        this.valueBindings = glu.deepApplyIf({eventName : 'textchanged'},this.valueBindings);
    }
});