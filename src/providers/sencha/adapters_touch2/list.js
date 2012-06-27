/*
 * Copyright (c) 2012 CoNarrative
 */
glu.regAdapter('list', {
     extend:'component',
    /**
     * @event itemdblclick
     * Fired after a selection change has occurred
     * @param {Ext.grid.Panel} this
     * @param {Ext.data.Model} selected The selected record
     *
     * **Convention if name is *item*List ** : @{open*Item*}
     */
    applyConventions:function (config, viewModel) {
        var g = glu.conventions;
        var listname = config.name;
        var name = glu.string(listname).until('List');
        var upperName = glu.string(name).toPascalCase();
        var selectionModelProp = viewModel[name + 'Selections'] ? name + 'Selections' : name + 'Selection';
        var pattern = {
            store:g.expression(listname),
//            focus:g.expression(name + 'WithFocus', {optional:true}),   //not in ExtJS
              selected:g.expression(selectionModelProp, {optional:true}), //not in ExtJS
            listeners:{
                itemsingletap:g.expression('open' + upperName, {optional:true, up:true})
            }
        };
        glu.deepApplyIf(config, pattern);
        //glu.provider.adapters.Panel.prototype.applyConventions.apply(this, arguments);
        delete config.items; //even though a container in terms of expand/collapse, a grid cannot have items!
    },
    beforeCreate:function (config, viewModel) {

    },
    afterCreate:function (control, viewModel) {
//        var sm = control.getSelectionModel();
//        if (!sm) return;
//        if (!sm.delayedEvent) {
//            sm.delayedEvent = new Ext.util.DelayedTask(function () {
//                if (Ext.getVersion().major > 3) {
//                    control.fireEvent('selectionsChanged', control, sm.getSelection())
//                } else {
//                    control.fireEvent('selectionsChanged', control, sm.getSelections());
//                }
//            });
//        }
//        sm.addListener('selectionchange', function () {
//            sm.delayedEvent.delay(1); //hopefully will keep from firing twice...
//        }, control);
//        control.delayedEvent = new Ext.util.DelayedTask(function () {
//            control.fireEvent('selectionChanged', control, control.getSelection())
//        });
//
//        control.addListener('selectionchange', function (list, selections,opts) {
//           //list.delayedEvent.delay(1);
//            control.fireEvent('selectionChanged', control, selections)
//        }, control);


    },
    storeBindings:{
        suppressViewModelUpdate:true
    },
//    selectionBindings:{
//        eventName:'itemsingletap',
//        eventConverter:function (g, e) {
//            debugger;
//            return e.length > 0 ? e[e.length - 1] : null;
//        }
////        customControlListener:function (config) {
//////            var grid = config.control;
//////            grid.on('s')
////        },
////        setComponentProperty:function (value, oldValue, options, control) {
//////            glu.log.info('selecting records on grid...');
//////            //a hack based on an internal...
//////            var sm = control.getSelectionModel();
//////            sm.silent = true;
////////            sm.selectRecords(value);
//////            sm.silent = false;
////        }
//    },
//    selectionsBindings:{
//        eventName:'itemsingletap',
//        eventConverter:function (g, e) {
//            debugger;
//            return e.length > 0 ? e[e.length - 1] : null;
//        }
////        customControlListener:function (config) {
//////            var grid = config.control;
//////            grid.on('s')
////        },
////        setComponentProperty:function (value, oldValue, options, control) {
//////            glu.log.info('selecting records on grid...');
//////            //a hack based on an internal...
//////            var sm = control.getSelectionModel();
//////            sm.silent = true;
////////            sm.selectRecords(value);
//////            sm.silent = false;
////        }
//    },
    selectedBindings:{
        eventName:'itemsingletap',
        eventConverter:function (g, e) {
//            if (g._singleSelect) {
//                return e.length > 0 ? e[e.length - 1] : null;
//            } else {
//                return e;
//            }
            return e;
        }
    }
});
//Ext.reg('checkboxsm', Ext.grid.CheckboxSelectionModel);
//Ext.reg('rowsm', Ext.grid.RowSelectionModel);
