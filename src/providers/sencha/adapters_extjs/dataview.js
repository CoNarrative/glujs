/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.dataview
 * @author Travis Barajas
 * @extends glu.extjs.adapters.component
 * Binds to a data view and handles selection.
 *
 *
 */
glu.regAdapter('dataview', {
    extend : 'component',
    /**
     *  @cfg {Array} selected
     *  Binds currently selected records
     *  *Two-way binding*
     */
    selectedBindings:{
        eventName:'selectionchange',
        eventConverter:function (control) {
            return control.getSelectedRecords();
        },
        setComponentProperty:function (value, oldValue, options, control) {
            //do nothing for now...
        }
    }
});