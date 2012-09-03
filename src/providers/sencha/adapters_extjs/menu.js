/**
 * class glu.extjs.adapters.menu
 * @extends glu.extjs.adapters.panel
 */
glu.regAdapter('menu' ,{
    extend : 'panel',
    defaultTypes:{
        items:'menuitem'
    },
    itemsBindings:{
        custom:function (context) {
            glu.provider.itemsHelper.bindItems(context);
        }
    }
});

/**
 * @class glu.extjs.adapters.menuitem
 * @extends glu.extjs.adapters.component
 */
glu.regAdapter('menuitem', {
    extend : 'component',

    applyConventions: function(config, viewmodel) {
        Ext.applyIf (config, {
            handler : glu.conventions.expression(config.name,{up:true}),
            text : glu.conventions.asLocaleKey(config.name)
        });
        glu.provider.adapters.Component.prototype.applyConventions.apply(this, arguments);
    },

    /**
     * @cfg {Boolean} checked
     * *Two-way binding*. The checked state of the menu item.
     */
    checkedBindings:{
        eventName:'checkchange',
        eventConverter:function (item, checked) {
            return checked;
        },
        setComponentProperty : function(value, oldValue, options, control) {
            control.setChecked(value,true);//suppress event
        }
    },
    isChildObject : function(propName){
        return propName==='menu';
    },

    menuShortcut : function(value) {
        return {
            xtype:'menu',
            defaultType:'menuitem',
            items:value
        };
    }
});