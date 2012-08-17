glu.regAdapter('field', {
    extend:'component',
    applyConventions:function (config, viewmodel) {
        Ext.applyIf(config, {
            value:glu.conventions.expression(config.name),
          //  valid:glu.conventions.expression(config.name + 'IsValid', {optional:true}),
            label:glu.conventions.asLocaleKey(config.name)
        });
        glu.provider.adapters.Component.prototype.applyConventions.apply(this, arguments);
    },
    valueBindings:{
        eventName:'change',
        eventConverter:function (field, newVal) {
            return field.getValue()
        },
        setComponentProperty:function(value,oldvalue,options,control){
            control.suspendCheckChange++;
            control.setValue(value);
            control.lastValue = value;
            control.suspendCheckChange--;
        }
    }
});