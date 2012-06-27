/*
 * Copyright (C) 2012 by CoNarrative
 */
if (!Ext.reg) {
    Ext.reg = function (name, ctor) {
        Ext.ClassManager.setAlias('widgets.' + name, ctor);
    };

    Ext.grid.CheckboxSelectionModel = Ext.selection.CheckboxModel;
    Ext.grid.RowSelectionModel = Ext.selection.RowModel;
}

/*Add to Ext 3.x*/
if (!Ext.getVersion) {
    Ext.getVersion = function () {
        return Ext.version;
    }
}
if (!Ext.getProvider) {
    Ext.getProvider = function () {
        return {provider:'extjs'}
    }
};
