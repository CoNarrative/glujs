/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.editor
 * @author Mike Gai
 * @extends glu.extjs.adapters.component
 *
 * A binder that adapts facilitates the inline declarative use of the ExtJS Editor. Ordinarily, you have to
 * manage the editor yourself in a handler, but that goes against the declarative GluJS grain.
 */
glu.regAdapter('editor', {
    extend :'field',

    isChildObject : function(propName) {
        return propName === 'field';
    },

    inEditModeBindings : {

    }

});

