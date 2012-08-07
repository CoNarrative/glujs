/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.field
 * @extends glu.extjs.adapters.component
 *
 * Fields in glu share two basic properties : a value property whose change behavior is normalized across all field types
 * (even in Ext 3.x), and a fieldLabel.
 * In form-rich applications, glu encourages you to find ways to minimize their visual setup down to simply specifying their
 * grouping and order:
 *      {
 *          xtype : 'form',
 *          defaultType : 'autofield',
 *          items : ['name','ssn', {
 *                  xtype:'fieldset',
 *                  items:['street',
 *                      {
 *                          xtype : 'fieldcontainer',
 *                          layout : 'hbox',
 *                          items : ['city','state','zip']
 *                      }
 *                  ]
 *              }]
 *       }
 *
 * That way, visual conventions can be easily managed globally without having to create additional component/widgets,
 * and with an easy way to opt-out for individual fields (just fully specify what they should look like as normal).
 *
 * See the {@link autofield} for an example of how to auto-generate xtypes/configurations for your fields.
 */
Ext.ns('glu.provider.adapters');
glu.regAdapter = glu.provider.regAdapter;

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
        }
    }
});

glu.regAdapter('fieldset', {
    extend : 'container',
    defaultTypes:{
        items:'textfield'
    },
    applyConventions : function(config, viewmodel) {
        Ext.applyIf(config, {
            collapsed : glu.conventions.expression(config.name + 'IsExpanded', {
                optional : true,
                not : true
            })
        });
        glu.provider.adapters.Container.prototype.applyConventions.apply(this, arguments);
    }
});
