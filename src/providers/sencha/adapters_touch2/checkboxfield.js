glu.regAdapter('checkboxfield', {
    extend:'field',
    applyConventions:function (config, viewmodel) {
        Ext.applyIf(config, {
            checked:glu.conventions.expression(config.name),
            label:glu.conventions.asLocaleKey(config.name)
        });
    },
    beforeCreate:function (config, viewmodel) {
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
