/*
 * Copyright (c) 2012 CoNarrative
 */
if (!Ext.getProvider) {
    Ext.getProvider = function () {
        return {provider:'touch', version:'2.0.1'}
    }
};

/*Add to Ext 3.x*/
if (!Ext.getVersion) {
    Ext.getVersion = function () {
        return Ext.version;
    }
}
if (!Ext.reg) {
    Ext.reg = function (name, ctor) {
        Ext.ClassManager.setAlias('widgets.' + name, ctor);
    };

}

