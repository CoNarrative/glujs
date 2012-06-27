/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.label
 * @author Mike Gai, Nick Tackes
 * @extends glu.extjs.adapters.component
 */
glu.regAdapter('label', {
    extend : 'field',
    /**
     * @cfg {String} text
     *
     * The text of the label.
     *
     * **Convention:** &#126;&#126;*firstName*&#126;&#126;
     */
    applyConventions:function (config, viewmodel) {
        Ext.applyIf(config, {
            'text' : '~~' + config.name + '~~'
        });
        glu.provider.adapters.Field.prototype.applyConventions.apply(this, arguments);
    }
});
