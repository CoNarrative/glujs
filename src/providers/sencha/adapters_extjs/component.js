/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.component
 * @type {Object}
 * Base component adapter for all ExtJS components.
 * Please note that GluJS provides some additional behavior for the 'xtype' property (see below) as well as 'viewMode'
 * property for organizing your views.
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
    /**
     * @cfg {String} viewMode
     * Specifies which "mode" to put the view in, assuming that mode is defined. If no viewMode is supplied (which is typical) then
     * it uses the default defined view. To supply different modes for a view, define it as follows in defView:
     * 
     *     defView ('assets.asset', 'detail', { ...});
     * 
     * where 'detail' is the name of the mode.
     * 
     * You can then use it wherever you would insert a child view (either through items binding or as a placeholder). In the case
     * of a static child view, it looks like the following within the parent view definition:
     * 
     *     items : [{
     *         xtype : '@{assetWithFocus}', //a property on the parent view model that contains a view model of type 'asset'
     *         viewMode : 'detail' //tells gluJS to use the 'detail' mode
     *     }]
     * 
     * For a collection of items using items binding, use the ExtJS defaults property to assing viewMode to all of the children:
     * 
     *     items : '@{assetList}', //a List of asset view models
     *     defaults : {viewMode:'detail'} //all of the child views will be put
     * 
     * Currently viewMode is not bindable, but we have plans to make it bindable in a future release to make it simple to flip between
     * modes (such as read-only and edit modes, or whatever you define). For now you can achieve the same thing with a card layout that
     * contains the two views and flipping between them.
     */

    /**
     * @cfg {String} xtype
     * Specifies the xtype of the view per normal ExtJS. However, there are two extensions:
     * 
     * ##Includes (xtype shortcut)
     * Sometimes a view bound to a single view model becomes big enough that you want to split it up into separate files without
     * having to make it a true nested view bound to a different view model. Since GluJS respects "local namespaces", you can simply inline the view
     * *without* having to declare an xtype alias :
     *
     *     glu.defineView('helloworld.main',{
     *        title : 'My top level view',
     *        layout:'hbox',
     *        items : [{html:'a panel declared inline'}, { xtype : 'aboutCompany'}]
     *     });
     *     glu.defineView('helloworld.aboutCompany',{
     *        title : 'Imagine a bunch of widgets about us'
     *     }); 
     *
     * ##Nested views
     * Since GluJS is all about UI composition of complicated UIs, there is often the need for nesting a view bound to a different view model
     * (usually a child view model) within a view bound to the parent view model. That is done as follows:
     *
     *     glu.defView ('assets.main',{
     *         layout : 'border',
     *         items : [{
     *             //GRID or "MASTER"
     *             xtype : 'grid',
     *             region : 'center',
     *         //a bunch of grid definition here...
     *         },{
     *             region : 'right',
     *             //VIEW CORRESPONDING TO DETAIL GOES HERE!
     *             xtype : '@{detail}'
     *         }]
     *     });
     *     glu.defView ('assets.asset',{
     *         xtype : 'form',
     *         items: [{
     *             fieldLabel : 'name',
     *             value : '@{name}'
     *         },{
     *             //...etc...
     *         }]
     *     });
     *
     *
     * This is a 1-time binding and *NOT LIVE* (at least not yet). We will be adding support for 'mutable views' in the future, but for
     * now you can achieve the same thing easily enough with a card layout binding.
     */
});