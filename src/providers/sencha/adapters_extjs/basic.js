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
    },

    afterCreate : function(control, viewmodel) {
        glu.provider.adapters.Container.prototype.afterCreate.apply(this, arguments);
        var expandOrCollapseFactory = function(expanded) {
            return function(control) {
                if( control.supressCollapseEvents )
                    return true;
                control.fireEvent('expandorcollapserequest', control, expanded);
                return false;
            }
        };

        if( control._bindingMap.collapsed ){
            control.on('beforecollapse', expandOrCollapseFactory(false));
            control.on('beforeexpand', expandOrCollapseFactory(true));
        }

        if (control._bindingMap && control._bindingMap.activeItem!==undefined) {
            control.addActual = control.add;
            control.add = function(index, item) {
                item.on('render', function() {
                    item.getEl().on('click', function() {
                        control.fireEvent('activeitemchangerequest', control, control.items.indexOf(item));
                    });
                });
                control.addActual(index, item);
            }
        }
    },

    collapsedBindings : {
        eventName : 'expandorcollapserequest',
        eventConverter : function(control, expanded) {
            return !expanded;
        },
        storeValueInComponentAs : 'collapsedActual',
        setComponentProperty : function(value, oldValue, options, control) {
            control.supressCollapseEvents = true;
            if (value == true) {
                if (control.rendered) {
                    control.collapse();
                } else {
                    control.collapsed = true;
                }
            } else {
                if (control.rendered) {
                    //hack for ext 4...
                    control.expand();
                } else {
                    control.collapsed = false;
                }
            }
            control.supressCollapseEvents = false;
        }
    },
});
