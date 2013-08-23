/*
* Copyright (C) 2012 by CoNarrative
*/
/**
 * @class glu.extjs.adapters.panel
 * @author Mike Gai, Nick Tackes, Travis Barajas
 * @extends glu.extjs.adapters.container
 * A basic adapter for all things panel.
 *
 *
 */
glu.regAdapter('panel', {
    extend : 'container',
    applyConventions : function(config, viewmodel) {
        Ext.applyIf(config, {
            collapsed : glu.conventions.expression(config.name + 'IsExpanded', {
                optional : true,
                not : true
            })
        });
        glu.provider.adapters.Container.prototype.applyConventions.apply(this, arguments);
    },

    isChildArray : function(propName, value) {
        return propName=='editors' || propName === 'items' || propName === 'dockedItems';
    },

    isChildObject : function(propName) {
        return propName === 'tbar' || propName === 'bbar' || propName === 'buttons' || propName === 'fbar' || propName === 'lbar' || propName === 'rbar';
    },

    tbarShortcut : function(value) {
        return {
            xtype : 'toolbar',
            defaultType : 'button',
            items : value,
            dock : 'top'
        }
    },

    bbarShortcut : function(value) {
        return {
            xtype : 'toolbar',
            defaultType : 'button',
            items : value,
            dock : 'bottom'
        }
    },

    buttonsShortcut : function(value, config) {
        return {
            xtype : 'toolbar',
            defaultType : 'button',
            items : value,
            dock : 'bottom',
            layout : {
                // default to 'end' (right-aligned)
                pack : { left:'start', center:'center' }[config.buttonAlign] || 'end'
            }
        }
    },

    fbarShortcut : function(value, config) {
        return {
            xtype : 'toolbar',
            defaultType : 'button',
            items : value,
            dock : 'bottom',
            layout : {
                // default to 'end' (right-aligned)
                pack : { left:'start', center:'center' }[config.buttonAlign] || 'end'
            }
        }
    },

    lbarShortcut : function(value) {
        return {
            xtype : 'toolbar',
            defaultType : 'button',
            items : value,
            vertical : true,
            dock : 'left'
        }
    },

    rbarShortcut : function(value) {
        return {
            xtype : 'toolbar',
            defaultType : 'button',
            items : value,
            vertical : true,
            dock : 'right'
        }
    },
    /**
     * @cfg {Function} closeHandler
     * The handle to process a 'close me' request from either a window close button or a tab close button.
     * By default it will call the 'close' method on the view model.
     * If you override the close method, use the doClose()
     * method on the view model to actually perform the close operation. To veto a close because the screen is not
     * valid would look like this:
     *      //view model assuming using default {@close} binding
     *      close : function() {
     *          if (this.isValid) {
     *              this.doClose();
     *          }
     *      }
     * Default: '{@close}'
     */
    beforeCollect : function(config) {
        glu.provider.adapters.Container.prototype.beforeCollect.apply(this, arguments);
        this.checkForEditors(config, {title: function(control){return control.header.titleCmp.textEl;}});
        //auto-add the close listener
        config.closeHandler = config.closeHandler || '@{close}';
    },
    beforeCreate : function(config, vm) {
        config.listeners = config.listeners || {};
        //The ExtJS close cycle is too strange and must be normalized
        //Now it will simply create a close request instead of anything funny...
        config.listeners.beforeclose = config.listeners.beforeclose ||
        function(panel) {
            // config.closeTask = config.closeTask || new Ext.util.DelayedTask();
            // config.closeTask.delay(1,function(){
            // panel.fireEvent('closerequest', this);
            // });
            if (config.closeHandler) {
                config.closeHandler.apply(vm);
            }
            return false;
        };

    },
    afterCreate : function(control, viewmodel) {
        glu.provider.adapters.Container.prototype.afterCreate.apply(this, arguments);
        //make sure windows close themselves when their matching view model closes...
        if (control.isWindow && Ext.isFunction(control.close)) {
            viewmodel.on('closed', function() {
                glu.log.debug('closed matching window since viewmodel was closed');
                if (control.hidden) {
                    control.doClose();
                } else {
                    control.hide(null, control.doClose, control);
                }
            });
        }
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

        if (control._bindingMap && control._bindingMap.activeItem!==undefined && control.getLayout().type != 'card') {
            control.addActual = control.add;
            control.add = function(index, item) {
                item.on('render', function() {
                    item.getEl().on('click', function() {
                        control.fireEvent('activeitemchangerequest', control, control.items.indexOf(item), item);
                    });
                });
                control.addActual(index, item);
            }
        }

        if (control._activeIndex !== undefined) {
            control.on('render', function(panel){
                panel._changeOriginatedFromModel = true;
                panel.getLayout().setActiveItem(panel._activeIndex);
            });
        }
    },
    /**
     * @cfg {String} html
     * *one-way binding.* The inner html to place in the body
     */
    htmlBindings : {
        setComponentProperty : function(value, oldValue, options, control) {
            // if the value is an object
            control.update(value);
        }
    },
    dataBindings : {
        setComponentProperty : function(value, oldValue, options, control) {//TODO: should really be the html property
            // if the value is an object
            control.update(value);
        }
    },

    /**
     * @cfg {Boolean} html
     * *one-way binding.* Whether or not the panel is collapsed.
     * Since there is a collapsed tool, we will support two-way binding in the future.
     *
     * **Convention:** @{*foo*IsCollapsed}
     */
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
                    control.collapse(control.collapseDirection, control.animCollapse);
                } else {
                    control.collapsed = true;
                }
            } else {
                if (control.rendered) {
                    //hack for ext 4...
                    control.expand(control.animCollapse);
                } else {
                    control.collapsed = false;
                }
            }
            control.supressCollapseEvents = false;
        }
    },

    /**
     * @cfg closable
     * *one-time binding ExtJS 3.x, one-way binding ExtJS 4.x*
     */
    closableBindings : {
        setComponentProperty : function(value, oldValue, options, control) {
            if (!(Ext.getVersion().major > 3)) return;
            if (control.tab) {
                //for a panel in a tab panel
                control.tab.setClosable(value);
                return;
            }
            if (control.header) {
                for (var i =0;i<control.header.items.getCount();i++){
                    var tool = control.header.items.getAt(i);
                    if (tool.type === 'close') {
                        tool.setVisible(value);
                        return;
                    }
                }
                //couldn't find it so add if true
                if (value===true) {
                    control.addClsWithUI('closable');
                    control.addTool({
                        type: 'close',
                        handler: Ext.Function.bind(control.close, control, [])
                    });
                }
            }
        }
    },

    activeItemBindings : {
        eventName:'activeitemchangerequest',
        eventConverter:function (control, idx, item) {
            return control._activeItemValueType==='viewmodel'?item._vm:idx;
        },
        storeValueInComponentAs : '_activeIndex',
        setComponentProperty:function (value, oldValue, options, control) {
            if (value===undefined || value===-1) {
                return; //nothing to do ... can't really "deselect" card/tab within ExtJS
            }
            if (value.mtype) {
                control._activeItemValueType = 'viewmodel';
                value = control.items.findIndexBy(function(card){return card._vm == value;});
                if (value==-1) throw new Error("Could not find a item in card layout bound to the view model passed to activeItem");
            }
            var oldItem = oldValue==-1?null : control.items.getAt(oldValue);
            control._changeOriginatedFromModel = true;
            if( control.getLayout().type == 'card')
                control.getLayout().setActiveItem(value);
            else
                control.fireEvent('activeitemchanged', control, control.items.getAt(value), oldItem);
        },
        transformInitialValue : function (value, config, viewmodel){
            if (value.mtype) {
                if (value.parentList === undefined) {
                    throw new Error("Attempted to set an activeTab to a view model that is not in a list.  You should always set the activeItem in the init()");
                }
                config._activeItemValueType = 'viewmodel';
                config._activeIndex = value.parentList.indexOf(value);
                //This is never going to work anyway because ExtJS doesn't care about activeTab when there are no items
                //And we haven't put the items in yet
                return -1;
            }
            return value;
        }
    },

    //TODO: Move into change tracked panel!!! BUt right now transformers don't supply bindings...
    enableTrackingBindings : {
        setComponentProperty : function(value, oldValue, options, control) {
            var idx = value ? 0 : 1;
            var active = control.items.get(idx);
            if (control.rendered) {
                control.getLayout().setActiveItem(active);
            } else {
                control.activeItem = active;
            }
        }
    },
    itemsBindings : {
        custom : function(context) {
            if (context.control.layout != 'card') {
                //do regular bindings
                glu.provider.itemsHelper.bindItems(context, true);
                return;
            }

            var activator = context.viewmodel.get(context.binding.modelPropName);
            var cardPanel = context.control;

            glu.provider.itemsHelper.bindItems(context);
        }
    }
});
