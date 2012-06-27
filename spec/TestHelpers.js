//TODO: Decide how to setup providers for Test Helpers.
glu.namespace('TestHelpers.ExtProvider');

TestHelpers.ExtProvider.controls = function () {
    return {
        findByName:function (control, xtype, bindName) {
            glu.log.info('Looking for xtype: ' + xtype + ' with bindName of ' + bindName);
            for (var propName in control) {

                if (!control.hasOwnProperty(propName))
                    return;
                var value = control[propName];

                if (glu.isObject(value)) {
                    value = [value];
                }

                //if ((propName == 'items' && glu.isArray(value)) || propName == 'tbar' || propName == 'bbar') {
                if (propName == 'items' || propName == 'tbar' || propName == 'bbar' || propName == 'toolbars') {
                    var defaultXtypes = {
                        tbar:'button',
                        bbar:'button',
                        toolbars:'button',
                        items:'panel'
                    };
                    var items;

                    if (propName == 'items') {
                        items = value[0].items;
                    } else if (propName == 'toolbars') {
                        if (value.length > 0) {
                            items = value[0].items.items;
                        }
                    }

                    for (var i = 0; i < items.length; i++) {
                        items[i].xtype = items[i].xtype || defaultXtypes[propName];
                        var cmp = this.findByName(items[i], xtype, bindName);
                        if (glu.isObject(cmp)) {
                            return cmp;
                        }
                    }
                }
                if (propName == 'xtype' && glu.isString(control.name)) {

                    if (value == xtype && control.name == bindName) {
                        glu.log.info('Found it: ' + propName + value + control.name);
                        return control;
                        break;
                    }
                }
            }

        },
        click:function (compName) {
            // pass in the control or the id
            var button = Ext.isString(compName) ? Ext.getCmp(compName) : compName;
            if (!button)
                throw 'Could not find clickable item with id of ' + compName;
            if (!button.btnEl) {
                //Ext.getVersion().major --for Ext 4.0 which is not as headless (moved backward)
                button.btnEl = {dom:{setAttribute:function () {
                }}};
            }
            button.onClick.call(button, {
                preventDefault:Ext.emptyFn,
                stopEvent:Ext.emptyFn,
                button:0
            });
        },
        select:function (compName, value) {
            var button = Ext.getCmp(compName);
            if (!button)
                throw 'Could not find clickable item with id of ' + compName;
            //FIRST: Mock the view
            if (!button.view) {
                button.view = {
                    selectedIndexes:[],
                    getSelectedIndexes:function () {
                        return this.selectedIndexes;
                    },
                    select:function (id) {
                        this.selectedIndexes = [id];
                    },
                    getNode:function () {
                    }
                }

            }

            if (Ext.getVersion().major > 3) {
                button.select(value);
                button.fireEvent('select', button, Ext.isArray(value) ? value : [value]);
            } else {
                //STEP 1: Select the item in the view -- DOES NOT CHANGE VALUE! Just like keying through in list
                button.selectByValue(value);
                //STEP 2: Select the actual value
                button.onViewClick.call(button, false);
            }

        }
    }
}();
TestHelpers.ExtProvider.events = function () {
    return {
        hasListener:function (control, eventName) {
            return glu.isArray(control.events[eventName].listeners) == true ? (control.events[eventName].listeners.length > 0) : false;
        }
    }

}();

TestHelpers.ExtProvider.data = function () {
    return {
        hasValue:function (control, value) {
            return control.value == value;
        }
    }
}();
exthelper = TestHelpers.ExtProvider.controls;
Ext.ns('test.control');
Ext.apply(test.control, TestHelpers.ExtProvider.controls);
