/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.field
 * @author Mike Gai
 * @extends glu.extjs.adapters.component
 * Base adapter for all of the various field types
 */
glu.regAdapter('field', {
    extend:'component',
    applyConventions:function (config, viewmodel) {
        Ext.applyIf(config, {
            value:glu.conventions.expression(config.name),
            valid:glu.conventions.expression(config.name + 'IsValid', {optional:true}),
            fieldLabel:glu.conventions.asLocaleKey(config.name)
        });
        glu.provider.adapters.Component.prototype.applyConventions.apply(this, arguments);
    },
    beforeCollect:function (config, viewmodel) {
        this.checkForEditors(config, {fieldLabel:'labelEl',value:'inputEl'});
    },
    /**
     * @cfg {String/Number} value
     *
     * *Two-way binding*. The value of this field.
     *
     * **Convention: ** @{*firstName*}
     */

    /**
     * @cfg {String} fieldLabel
     *
     * The label that will be applied to this field if in the appropriate layout.
     *
     * Usually, it is best to make sure that this is a localization key and not an exact text literal
     *      fieldLabel: '~~firstName~~'
     * will look up the key 'firstName' in the localizer and replace with the appropriate text
     *
     * **Convention: ** &#126;&#126;*firstName*&#126;&#126;
     */

    /**
     * @cfg {Boolean/String} valid
     * *One-way binding*
     * Updates the validity marking of the field.
     * The view model property can be either a boolean true/false
     * or a string (empty for valid, anything else will be the error message)
     *
     * **Convention:** @{*foo*IsValid}
     */
    validBindings:{
        setComponentProperty:function (newValue, oldValue, options, control) {
            var text = control.invalidText;
            if (Ext.isString(newValue)) {
                text = newValue;
                newValue = newValue === '' ? true : false;
            }
            if (newValue == false) {
                control.valid = false;
                control.markInvalid(text);
            } else {
                control.valid = true;
                control.clearInvalid();
            }
        },
        onInit:function (binding, control) {
            //DISABLE INTERNAL VALIDATION ON THIS CONTROL!
            control.validate = Ext.emptyFn;
            //initialize with proper valid markings--must be done AFTER RENDER...
            var me = this;
            control.on('render', function () {
                //AND after it has REALLY rendered
                setTimeout(function () {
                    glu.provider.adapters.field.validBindings.setComponentProperty(control.valid, false, {}, control);
                }, 1);
            });
        }
    },

    valueBindings:{
        eventName:'change',
        eventConverter:function (field, newVal) {
            return field.getValue()
        }
    }
});