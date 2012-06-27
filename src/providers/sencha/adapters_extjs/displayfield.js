/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.displayfield
 * @author Mike Gai
 * @extends glu.provider.adapters.field
 */
glu.regAdapter('displayfield', {
    extend : 'field',
    valueBindings:{
        setComponentProperty:function (value, oldValue, options, control) {
            control.setValue(value);
            control.value = control.getValue();
        }
    }
});