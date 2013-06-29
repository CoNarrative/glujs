/*
 * Copyright (c) 2012 CoNarrative
 */
Ext.ns('glu.provider.adapters');
glu.regAdapter = glu.provider.regAdapter;

glu.regAdapter('component', {
    applyConventions:function (config, viewmodel) {
    },
    isChildArray:function (propName, value) {
        propName === 'items';
    },
    isChildObject:function () {
        return false;
    },
    processChildPropertyShortcut:function (propName, config) {
        return config;
    },
    beforeCreate:function(config){

    },
    beforeCollect:function (config) {

    },
    afterCreate:function (control, viewmodel) {

    },
    checkForEditors:function (config, propConfigs) {
        for (var name in propConfigs) {
            var editor = config[name];
            if (!Ext.isObject(editor)) continue;
            //it's an editor
            config[name] = editor.value; //move the fixed value or binding into the property
            config.editors = config.editors || [];
            config.propName = name;
            editor.xtype = 'editor';
            editor.target = propConfigs[name];
            editor.trigger = editor.trigger || 'dblclick';
            editor.field.value = editor.field.value || editor.value;
            delete editor.value;
            config.editors.push(editor);
        }
    }
});


