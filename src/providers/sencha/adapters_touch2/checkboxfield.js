glu.regAdapter('checkboxfield', {
    extend:'field',
    applyConventions:function (config, viewmodel) {
        Ext.applyIf(config, {
            checked:glu.conventions.expression(config.name),
            //  valid:glu.conventions.expression(config.name + 'IsValid', {optional:true}),
            label:glu.conventions.asLocaleKey(config.name)
        });
        //glu.provider.adapters.Component.prototype.applyConventions.apply(this, arguments);
    },
    beforeCreate:function (config, viewmodel) {
//        config.checked = config.checked || config.value;
    },
    afterCreate:function (control, viewmodel) {
        control.addListener('check', function (control) {
            control.fireEvent('checkedChanged', control, control.getChecked());
        }, control);

        control.addListener('uncheck', function (control) {
            control.fireEvent('checkedChanged', control, control.getChecked());
        }, control);
    },
    checkedBindings:{
        setComponentProperty:function (value, oldValue, options, control) {
            control.setChecked(value)
        },
        eventName:'checkedChanged',
        eventConverter:function (control, newValue) {
            return control.getChecked();
        }
    }
});
