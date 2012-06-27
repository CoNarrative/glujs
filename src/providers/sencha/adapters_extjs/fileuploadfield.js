/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.regAdapter('fileuploadfield', {
    extend : 'field',
    valueBindings:{
        eventName:'fileselected',
        eventConverter:function (control) {
            return control.getValue();
        }
    }
});