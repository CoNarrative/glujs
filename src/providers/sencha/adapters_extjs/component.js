/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.component
 * @type {Object}
 */
glu.regAdapter('component', {
    applyConventions: function(config, viewmodel){
        var g = glu.conventions;
        var pattern = {
            disabled:g.expression(config.name + 'IsEnabled', {optional:true, not:true}),
            hidden:g.expression(config.name + 'IsVisible', {optional:true, not:true})
        };
        glu.deepApplyIf(config, pattern);
    },
    //is the property an array to walk?
    isChildArray : function(){
        return false;
    },
    //is the property a sub-item to recurse into?
    isChildObject : function(){
        return false;
    },
    processChildPropertyShortcut : function(propName, config){
        return config;
    },
    /**
     * @cfg {String} cls
     * *one-way binding.* Sets a convenience css class. Since the binding removes the old class before adding the new, this
     * property is suitable for a variety of dynamic class effects, made easy by using text substitutions in the binding. For example:
     *      cls : 'my-widget-status-@{status}'
     * will dynamically change the class by naming convention to match the current status.
     */
    clsBindings:{
        setComponentProperty:function (newValue, oldValue, options, control) {
            if (control.removeCls) {
                control.removeCls(oldValue);
            } else {
                control.removeClass(oldValue);
            }
            control.addClass(newValue);
        }
    },
    /**
     * @cfg {String} itemCls
     * *one-way binding.* Sets a convenience item css class. Since the binding removes the old class before adding the new, this
     * property is suitable for a variety of dynamic class effects, made easy by using text substitutions in the binding. For example:
     *      itemCls : 'my-widget-status-@{status}'
     * will dynamically change the class by naming convention to match the current status.
     */
    itemClsBindings:{
        setComponentProperty:function (newValue, oldValue, options, control) {
            if (control.el && control.el.parent) {
                var p = control.el.parent('.x-form-item');
                if (p === undefined) return;
                if (p.removeCls) {
                    p.removeCls(oldValue);
                } else {
                    p.removeClass(oldValue);
                }
            }
            control.itemCls = newValue;
        }
    },
    /**
     * @cfg {String} hidden
     * *one-way binding.* Sets the visibility of the component.
     *
     * **Convention:** @{*foo*IsHidden}
     */
    hiddenBindings:{
        setComponentProperty:function (newValue, oldValue, options, control) {
            if (control.xtype == 'radiogroup' && control.items && control.items.length > 0) {
                for (var i = 0; i < control.items.length; i++) {
                    if (Ext.isArray(control.items)) {
                        // do nothing.  this is due to the case where control is run in headless mode
//                        control.items[i].setVisible(!newValue);
                    }
                    else {
                        control.items.items[i].setVisible(!newValue);
                    }
                }
            }
            control.setVisible(!newValue);
            if (control.ownerCt) {
                control.ownerCt.doLayout();
            }
        }
    }

});