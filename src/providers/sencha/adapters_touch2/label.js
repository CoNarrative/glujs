/*
 * Copyright (c) 2012 CoNarrative
 */
glu.regAdapter('label', {
    extend:'component',
    applyConventions:function (config, viewmodel) {
        Ext.applyIf(config, {
            html:glu.conventions.expression(config.name),
            //  valid:glu.conventions.expression(config.name + 'IsValid', {optional:true}),
            //label:glu.conventions.asLocaleKey(config.name)
        });
    },
    beforeCollect:function (config, viewmodel) {
        this.checkForEditors(config, {fieldLabel:'labelEl', value:'inputEl', boxLabel:'boxLabelEl'});
        //prevent change checking - may be 4.0 only;
    },
    htmlBindings:{
        setComponentProperty:function (value, oldValue, options, control) {
            control.setHtml(value);
        }
    }
});