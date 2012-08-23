/*
* Copyright (C) 2012 by CoNarrative
*/
/**
 * @class glu.extjs.adapters.combo
 * @author Mike Gai
 * @extends glu.extjs.adapters.field
 *
 * The combo box is usually bound by value (by default the backing Model) and to a store.
 *
 * Note : This adapter eliminates race conditions caused by the value being set
 * before the backing store is loaded. When the store changes (a la the backing
 * data arrives), it will check to see if the value is now present and then set the combo
 * box accordingly.
 */

/*
 */
glu.regAdapter('combo', {
    extend : 'field',

    /**
     * @cfg {Ext.data.Store} store
     * The store for this grid.
     *
     * *One-time binding*
     *
     * **Convention**: @{*itemList*}
     */
    beforeCreate : function(config, viewmodel) {
        if (!config.store)
            return;
        if (config.store.gluTweaked == true)
            return;
        config.store.gluTweaked = true;
        var evtName = Ext.getVersion().major > 3 ? 'datachanged' : 'load';
        config.store.on(evtName, function() {
            var control = Ext.getCmp(config.id);
            if (!control)
                return;
            control.setValue(control.targetValue);
        });
    },
    afterCreate : function(control, viewmodel) {
        glu.provider.adapters.Field.prototype.afterCreate.apply(this, arguments);

        if (!control.delayedEvent) {
            control.delayedEvent = new Ext.util.DelayedTask(function() {
                control.fireEvent('valuechanged', control);
            });
        }

        if (control.enableKeyEvents) {
            control.addListener('keyup', function(t, e, o) {
                control.delayedEvent.delay(control.keyDelay || 100);
                //give some time for multiple keypresses...
            }, control);
        }

        control.addListener('select', function(t, e, o) {
            control.delayedEvent.delay(control.keyDelay || 100);
            //give some time for multiple keypresses...
        }, control);

        //Solves a race condition in which the initial value is set before the backing store has been loaded
        //does not attempt to solve later race conditions with stores reloading
        if (!control.valueField)
            return;
        // var r = control.findRecord(control.valueField, control.value);
        // if(r) {
        // //reset the value one last time just in case the callback has already happened
        // control.setValue(control.value);
        // return;
        // }
        control.setValueActual = control.setValue;
        control.setValue = function(value) {
            this.targetValue = value;
            this.setValueActual(value);
        };
        control.setValue(control.value);
        //there is no record, so wait until load
        // control.store.on('load',function(){
        // control.setValue(control.value);
        // //control.store.un('load'); //stop listening for load event
        // });
    },
    beforeCollect : function(config) {
        glu.provider.adapters.Field.prototype.beforeCollect.apply(this, arguments);
        if (config.editable)
            config.enableKeyEvents = true;
    },
    initAdapter : function() {
        //this.valueBindings = glu.deepApplyIf({eventName : 'select'},this.valueBindings);
        this.valueBindings = glu.deepApplyIf({
            eventName : 'valuechanged'
        }, this.valueBindings);
    }
});

glu.regAdapter('combobox', {
    extend : 'combo'
}); 