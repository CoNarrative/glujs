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
		return propName === 'items' || propName === 'dockedItems';
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

	buttonsShortcut : function(value) {
		return {
			xtype : 'toolbar',
			defaultType : 'button',
			items : value,
			dock : 'bottom',
			layout : Ext.applyIf(toolbar.layout || {}, {
				// default to 'end' (right-aligned)
				pack : 'end'
			})
		}
	},

	fbarShortcut : function(value) {
		return {
			xtype : 'toolbar',
			defaultType : 'button',
			items : value,
			dock : 'bottom',
			layout : Ext.applyIf(toolbar.layout || {}, {
				// default to 'end' (right-aligned)
				pack : 'end'
			})
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
		//make sure windows close themselves when their matching view model closes...
		if (Ext.isFunction(control.close)) {
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
				control.fireEvent('expandorcollapse', control, expanded);
			}
		};
		control.on('collapse', expandOrCollapseFactory(false));
		control.on('expand', expandOrCollapseFactory(true));
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
		eventName : 'expandorcollapse',
		eventConverter : function(control, expanded) {
			return !expanded;
		},
		storeValueInComponentAs : 'collapsedActual',
		setComponentProperty : function(value, oldValue, options, control) {
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
		}
	},

	/**
	 * @cfg closable
	 * *one-time binding ExtJS 3.x, one-way binding ExtJS 4.x*
	 */
	closableBindings : {
		setComponentProperty : function(value, oldValue, options, control) {
			if (Ext.getVersion().major > 3 && control.tab) {
				control.tab.setClosable(value);
			}
		}
	},
	activeItemBindings : {
		setComponentProperty : function(value, oldValue, options, control) {
			//TODO: added this check due to headless access.  if fails because layout is not rendered
			if (!control.getLayout() || !control.getLayout().setActiveItem) {
				return;
			}
			control.getLayout().setActiveItem(value);
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
			//do the items bindings using the helper

			//now Activation stuff if really an activator...
			if (activator.getActiveIndex) {
				if (cardPanel.rendered == true) {
					cardPanel.getLayout().setActiveItem(activator.getActiveIndex());
				} else {
					cardPanel.activeItem = activator.getActiveIndex();
				}

				//listen (automatically) to change event on activeIndex
				activator.on('activeindexchanged', function(newvalue) {
					cardPanel._changeOriginatedFromModel = true;
					if (cardPanel.rendered == true) {
						cardPanel.getLayout().setActiveItem(activator.getActiveIndex());
					} else {
						cardPanel.activeItem = activator.getActiveIndex();
					}
				});
			}
		}
	}
});
