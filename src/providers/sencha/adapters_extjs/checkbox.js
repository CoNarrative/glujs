/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.checkbox
 * @author Mike Gai
 * @extends glu.extjs.adapters.field
 *
 * A binder that adapts a checkbox. Normalizes the 'checked' value so that you can bind on either 'value' or 'checked'
 */
glu.regAdapter('checkbox', {
    extend :'field',
    beforeCreate:function (config, viewmodel) {
        config.checked = config.checked || config.value;
    },
    initAdapter : function(){
        this.checkedBindings = this.valueBindings;
    },
    boxLabelBindings : {
        setComponentProperty: function(newValue,oldValue,options,control){
            if (control.rendered){
                control.boxLabelEl.update(newValue);
            }
            else{
                control.boxLabel = newValue;
            }
        }
    }
});

glu.regAdapter('checkboxfield', {
    extend: 'checkbox'
});

glu.regAdapter('radiofield', {
    extend :'checkbox',
    suppressNameBindings: true
});

glu.regAdapter('radio', {
    extend :'radiofield'
});