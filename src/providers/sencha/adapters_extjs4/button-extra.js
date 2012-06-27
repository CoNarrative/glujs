/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.provider.adapters.button.afterCreate = function (control) {
    //HACK: workaround for Ext 4.0.7 button bug in which toggle can only be called after render
    control.btnEl = {
        dom:{
            setAttribute:function () {
            }
        }
    };
}
