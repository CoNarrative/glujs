glu.regAdapter('htmleditor', {
    extend: 'textfield',

    /**
     * @cfg {Function} enterKeyHandler
     * A special GluJS convenience shortcut that handles the pressing of the "Enter" key when in the field
     */
    afterCreate: function(control, viewmodel) {
        glu.provider.adapters.Textfield.prototype.afterCreate.apply(this, arguments);
        control.addListener('sync', function(t, v, o) {
            if(control.lastSyncValue != v) {
                control.lastSyncValue = v;
                control.delayedEvent.delay(control.keyDelay || 100); //give some time for multiple keypresses...
            }
        }, control);
    }
});