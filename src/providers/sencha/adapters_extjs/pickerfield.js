/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.pickerfield
 * @author Mike Gai
 * @extends glu.extjs.adapters.field
 *
 * A binder that adapts pickers (datefields, etc.) which use a select event and can be collapsed /expanded.
 */
glu.regAdapter('pickerfield', {
    extend :'field',
    valueBindings:{
        eventName:'select',
        eventConverter:function (field, newVal) {
            return field.getValue()
        }
    },
    /**
     * @cfg {Boolean} html
     * *one-way binding.* Whether or not the picker is collapsed. This lets you 'auto open' the picker if needed
     * We will support the other direction in the future (so this is currently broken)
     * **Convention:** @{*foo*IsCollapsed}
     */
    collapsedBindings:{
        setComponentProperty:function (value, oldValue, options, control) {
            if (value == true) {
                if (control.rendered) {
                    control.collapse();
                } else {
                    control.collapsed = true;
                }
            } else {
                if (control.rendered) {
                    control.expand();
                } else {
                    control.collapsed = false;
                }
            }
        }
    }
});

