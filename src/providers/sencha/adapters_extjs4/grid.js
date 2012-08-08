/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.grid4
 * @author Mike Gai, Nick Tackes
 * @extends glu.extjs.adapters.panel
 * The grid binder adds support for various selection and focus patterns,
 * as well as for basic grid "commands" like sorting.
 *
 * ## Basic Ext 4.x grid binding
 *
 *        sample = {
 *            models : {
 *                student :{fields:[{name:'id'},{name:'firstName'}]},
 *            },
 *            viewmodels : {
 *                assignment : {
 *                    studentList : {
 *                        mtype : 'glustore',
 *                        model : 'student'
 *                    },
 *                    openStudent : function() {
 *                         this.message.('Opening student ' + this.studentWithFocus.get('firstName'));
 *                    },
 *                    studentSelections : [],
 *                    studentWithFocus : {},
 *                    studentListIsCollapsed : false,
 *                    studentListIsDisabled : false,
 *                    studentListIsHidden : false
 *                }
 *            },
 *            views : {
 *                assignment : {
 *                    items : [{
 *                        xtype : 'grid',
 *                        name : 'studentList'
 *                    }]
 *                }
 *            }
 *        };
 *
 */

glu.regAdapter('grid', {
    extend:'panel',
    /**
     * @event itemdblclick
     * Fired after a selection change has occurred
     * @param {Ext.grid.Panel} this
     * @param {Ext.data.Model} selected The selected record
     *
     * **Convention if name is *item*List ** : @{open*Item*}
     */
    applyConventions:function (config, viewmodel) {
        var g = glu.conventions;
        var listname = config.name;
        var name = glu.string(listname).until('List');
        var upperName = glu.string(name).toPascalCase();
        var selectionModelProp = viewmodel[name + 'Selections'] ? name + 'Selections' : name + 'Selection';
        var pattern = {
            store:g.expression(listname),
            focus:g.expression(name + 'WithFocus', {optional:true}),   //not in ExtJS
            selected:g.expression(selectionModelProp, {optional:true}), //not in ExtJS
            listeners:{
                itemdblclick:g.expression('open' + upperName, {optional:true, up:true}),
                refreshdata:g.expression('refresh' + upperName, {optional:true, up:true})
            }
        };
        glu.deepApplyIf(config, pattern);
        glu.provider.adapters.Panel.prototype.applyConventions.apply(this, arguments);
        delete config.items; //even though a container in terms of expand/collapse, a grid cannot have items!
    },
	
	isChildArray : function(propName, value) {
        return propName=='editors' || propName === 'items' || propName === 'dockedItems' || propName === 'columns';
    },

    isChildObject : function(propName) {
        return propName === 'tbar' || propName === 'bbar' || propName === 'buttons' || propName === 'fbar' || propName === 'lbar' || propName === 'rbar' || propName == 'colModel';
    },
	
    beforeCreate:function (config, viewmodel) {
        if (config.hasOwnProperty('selected')) {
            config._singleSelect = !glu.isArray(config.selected);
            //TODO: Check by name convention possibly
            //TODO: And also binding to other collections besides arrays would be nice
            if (Ext.getVersion().major > 3) {
                if (!config.selModel || config.selModel.mode === undefined) {
                    //auto-determine
                    config.selModel = config.selModel || {};
                    if (!config._singleSelect) {
                        config.selModel.mode = 'multi';
                    }
                }
            }
        }
        //walk through the columns collection and treat any strings as keys to doing auto-column generation
        if (!config.cm && !config.colModel && config.columns && config.store.recType) {
            var model = eval(config.store.ns + '.models.' + config.store.recType);
            var fields = model.fields;
            var columns = [];
            for (var i = 0; i < config.columns.length; i++) {
                var key = config.columns[i];
                if (!Ext.isString(key)) {
                    columns.push(key);
                    continue; //for now skip more fully fleshed out column definitions
                }
                var column = {
                    dataIndex:key,
                    header:glu.localize({ns:viewmodel.ns, viewmodel:config.store, key:key})
                    // width : autoWidth(key)
                };
                if (config.filterable) {
                    column.filter = {};
                }
                //check for custom renderer
                var fn = eval(config.store.ns + '.views.' + glu.string(config.store.recType).toPascalCase() + glu.string(key).toPascalCase() + 'ColumnRenderer');
                if (fn != null) {
                    column.header = '';
                    column.renderer = Ext.createDelegate(fn, viewmodel, [config.store.recType, key], true);
                }
                if (fields[i].width) {
                    column.width = fields[i].width;
                }
                columns.push(column);
            }
            config.columns = columns;
        }

        var sm = config.sm || config.selModel;
        if (sm && sm.xtype == 'checkboxsm') {
            delete config.sm;
            delete config.selModel;
            delete sm.xtype;
            //have to early create so can add to column model
            config.sm = new Ext.grid.CheckboxSelectionModel(sm);
            if (!Ext.getVersion().major > 3) {
                config.sm.isColumn = true; //TODO: Figure out why I need to do this now?
                config.columns.unshift(config.sm);
            }
        }
        if (Ext.getVersion().major > 3) {
            config.columns = {
                items:config.columns,
                defaults:{
                    sortable:true,
                    width:120
                }
            }
        } else {
            config.cm = new Ext.grid.ColumnModel({
                columns:config.columns,
                defaults:{
                    sortable:true,
                    width:120
                }
            });
            delete config.columns;
        }
        glu.provider.adapters.Panel.prototype.beforeCreate.apply(this,arguments);
    },
    afterCreate:function (control, viewmodel) {
        var sm = control.getSelectionModel();
        if (!sm) return;
        if (!sm.delayedEvent) {
            sm.delayedEvent = new Ext.util.DelayedTask(function () {
                if (Ext.getVersion().major > 3) {
                    control.fireEvent('selectionsChanged', control, sm.getSelection())
                } else {
                    control.fireEvent('selectionsChanged', control, sm.getSelections());
                }
            });
        }
        sm.addListener('selectionchange', function () {
            sm.delayedEvent.delay(1); //hopefully will keep from firing twice...
        }, control);

        //override focus on Ext 4.x
        if (control.hasOwnProperty('focus')) {
            if (Ext.getVersion().major > 3) {
                var sm = control.getSelectionModel();
                sm.setLastFocusedActual = sm.setLastFocused;
                sm.setLastFocused = function (record, supressFocus) {
                    if (supressFocus) { //implicit/forced focus
                        this.setLastFocusedActual(record, true);
                    }
                    control.fireEvent('focuschangerequest', control, record);
                };
            }
        }
        glu.provider.adapters.Panel.prototype.afterCreate.apply(this,arguments);
    },

    sortBindings:{
        eventName:'sortrequest',
        eventConverter:function (cntrl, info) {
            return info;
        },
        setComponentProperty:function (value, oldValue, options, control) {
            //do nothing
        }
    },

    /**
     * @cfg {Ext.data.Store} store
     * The store for this grid.
     *
     * *One-time binding*
     *
     * **Convention**: @{*itemList*}
     */
    storeBindings:{
        suppressViewmodelUpdate:true
    },

    /**
     * @cfg {Array/Ext.data.Model/Ext.data.Record} selected
     * Currently selected item(s) in the grid.
     * The binding type is automatically determined by the supplied viewmodel property type.
     * It will be an array of Model/Records if the target is an array, otherwise a single Model/Record.
     * Selections currently cannot be bound to Lists, Maps, or Stores though that may in the future be a useful addition.
     * If the bound property is an array and multi-select / mode flag on the grid has not been configured,
     * it will also automatically configure the grid as multi-select.
     *
     * **Convention if name is *item*List **: @{*item*Selections} for an array  /  @{*item*Selection} for a single record
     */
    selectedBindings:{
        eventName:'selectionsChanged',
        eventConverter:function (g, e) {
            if (g._singleSelect) {
                return e.length > 0 ? e[e.length - 1] : null;
            } else {
                return e;
            }
        },
        customControlListener:function (config) {
            var grid = config.control;
            grid.on('s')
        },
        setComponentProperty:function (value, oldValue, options, control) {
            glu.log.info('selecting records on grid to ' + value.length + ' rows.');
            //a hack based on an internal...
            var sm = control.getSelectionModel();
            //sm.select (value, false, true);
        }
    },

    /**
     * @cfg {Ext.data.Model/Ext.data.Record} focus
     * Item with current grid focus.
     * The focus is which row in the grid is the "current position". It's behavior
     * is determined by the underlying selection model; glu is simply surfacing it.
     * It is primarily used for master/detail patterns, where the detail shows the item
     * with focus, not necessarily the selection (which may be multiple).
     * In single-select mode, the item with focus corresponds to the item selection.
     * Focus is gained by "entering into" or selecting a row, and is not lost until
     * another row is selected (either by selecting one more in multi-select/simple,
     * or simply by selecting another in single-select). Deselecting a row does not
     * change the focus.
     *
     * **Convention if name is *item*List **: @{*item*WithFocus}
     */
    focusBindings:{
        eventName:'focuschangerequest',
        eventConverter:function (g, r) {
            return r;
        },
        setComponentProperty:function (value, oldValue, options, control) {
            control.getSelectionModel().setLastFocusedActual(value);
        }
    },

    //FOR GRIDFILTER PLUGIN
    /**
     * @cfg {Array} columnFilters
     * An array of filters corresponding to the Ext.ux.GridFilters plugin format
     *      {
     *      field : 'firstName',
     *      comparison : 'eq', (check this to make sure)
     *      value : 'Mi'
     *      }
     * The binding is two-way.
     * Since it is an array, the entire array is overwritten on each filter change.
     */
    columnFiltersBindings:{
        eventName:'filterupdate',
        eventConverter:function (gridfilter) {
            var raw = gridfilter.getFilterData();
            var actual = [];
            for (var i = 0; i < raw.length; i++) {
                var filter = raw[i];
                actual.push({field:filter.field, comparison:filter.data.comparison, value:filter.data.value});
            }
            return actual;
        },
        setComponentProperty:function (filters, oldValue, options, grid) {
            var filter, plugin = grid.filters;
            if (plugin.settingglu) return;
            plugin.applyingState = true;
            plugin.settingglu = true;
            plugin.clearFilters();
            for (var i = 0; i < filters.length; i++) {
                var src = filters[i];
                var key = src.field;
                filter = plugin.filters.get(key);
                if (!filter) {
                    continue;
                }
                filter.setValue(src.value);
                filter.setActive(true);
            }
            delete plugin.applyingState;
            delete plugin.settingglu;
        }
    }

    /**
     * @cfg items
     * @hide
     */
    /**
     * @cfg html
     * @hide
     */

});
Ext.reg('checkboxsm', Ext.grid.CheckboxSelectionModel);
Ext.reg('rowsm', Ext.grid.RowSelectionModel);

glu.regAdapter('treepanel', {
    extend:'grid'
});
