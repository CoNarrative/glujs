/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.regAdapter('progress', {
    extend : 'field',
    valueBindings:{
        setComponentProperty:function (value, oldValue, options, control) {
            control.updateProgress(value);
        }
    },
    textBindings:{
        setComponentProperty:function (value, oldValue, options, control) {
            control.updateText(value);
        }
    }
});

glu.regAdapter('progressbar', {
    extend : 'progress'
});
