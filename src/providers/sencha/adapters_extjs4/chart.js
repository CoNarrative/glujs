/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.panel
 * @author Mike Gai, Nick Tackes, Travis Barajas
 * @extends glu.extjs.adapters.container
 * A basic adapter for all things panel.
 *
 *
 */
glu.regAdapter('chart', {
    extend:'container',
    applyConventions:function (config, viewmodel) {
        glu.provider.adapters.Container.prototype.applyConventions.apply(this, arguments);
    },

    isChildArray:function (propName, value) {
        return propName === 'axes' || propName === 'series';
    },
    storeBindings:{
        suppressViewmodelUpdate:true
    }
});
