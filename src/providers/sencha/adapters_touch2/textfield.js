glu.regAdapter('textfield', {
    extend:'field',
    beforeCollect:function (config) {
        config.enableKeyEvents = true;
    },
    /**
     * @cfg {Function} enterKeyHandler
     * A special GluJS convenience shortcut that handles the pressing of the "Enter" key when in the field
     */
    afterCreate:function (control, viewmodel) {
        //glu.provider.adapters.Field.prototype.afterCreate.apply(this, arguments);
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
        control.addListener('keyup', function (t, e, o) {
            control.delayedEvent.delay(control.keyDelay || 100); //give some time for multiple keypresses...
        }, control);

        if (control.getInitialConfig().enterKeyHandler) {
            //special gluJS helper handler
            control.on('action', function (f, e) {
                if (e.event.keyIdentifier == 'Enter') {
                    control.fireEvent('textchanged', control); //force most recent
                    control.initialConfig.enterKeyHandler();
                }
            }, null, {delay:110});
        }
    },
    initAdapter:function () {
        this.valueBindings = glu.deepApplyIf({eventName:'textchanged'}, this.valueBindings);
    }
});

