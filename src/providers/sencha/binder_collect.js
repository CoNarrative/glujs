/*
 * Copyright (C) 2012 by CoNarrative
 */
Ext.ns('glu.provider.binder');

/**
 * @class glu.provider.Binder
 * Takes care of binding views to view models. This is a gluJS internal and you should never have to use this class directly.
 * ###Binding syntax
 *
 * * `!` Inverts a boolean value. Example: `collapsed:' {@!expanded}'`
 * * `.` Allows you to naturally traverse into child objects. Example: `text:'{@activeItem.displayText}'`
 *
 * * `..`: Find the property at this level or any level above. Example: `save:'{@..save}'` will bind to the save command/function at this view model level and if it cannot find it, walk up the `parentVM` chain until it does find it.
 * Now for the binding directives (these all come immediately after the `@` sign and before the `{` to indicate that they are about *how* and not *what* to bind.
 * * `1` One-time binding - do not listen or update. Example: `value:'@1{displayText}'` will provide an initial value to the control but the control will never affect `displayText` and changes to `displayText` will never affect the `value`.
 * * `>` One-way binding - update the view when the control changes, but not vice versa, making the control binding "read-only". Example: `value:'@>{displayText}'` will initially set the value to `displayText` and will track changes to that in the view model, but will never itself update the view model.
 * * `?` Optional binding - do not raise an error if the matching view model property is not found. This is usally only used when working with view adapters (extending GluJS) as ordinarily you want to know when you have a "bad binding'. Example: `value:'@?{displayText}'` will let the application continue smoothely even if there is no `displayText` on the view model.
 *
 *
 */
Ext.apply(glu.provider.binder, {

    /**
     * Walks an ExtJS control configuration (before it has been passed into an ExtJS control constructor/Ext.create/Ext.widget)
     * collects all the bindings it finds all of the way down while validating the bindings against the supplied view model
     * and writes initial values to the config object so that the ExtJS control can be created with appropriate values.
     * Also adds any "automatic plugins" supplied by the various adapters that will "clean up" Ext JS control behavior
     * to be more suitable for use within a MVVM framework.
     * @param {Object} config The configuration for the control
     * @param {Object} viewmodel The view model
     * @return {Array} The bindings array
     */
    collectBindings:function (config, viewmodel, parentConfig, parentPropName, parentAdapter, bindingsList, indents) {
        //STEP 1: apply parentage and things that only make sense when it is a child item
        if (parentConfig) {
            //preprocess
            if (glu.isString(config)) {
                if (config == '->' || config == '-' || config == '|') {
                    //skip - it's some other sort of shortcut string like for a menu item or button padding that can't be bound...
                    return {
                        config:config,
                        bindings:bindingsList
                    }
                }
                //otherwise, assume it's a name-bound field with the default type
                config = {
                    name:config
                };
            }
            //use cached adatper if available...
            var parentAdapter = parentAdapter || this.getAdapter(parentConfig);
            //default type is only if the collection is the items collection
            var defaultTypeForItems = parentPropName == 'items' ? parentConfig.defaultType : null;
            var adapterSpecificDefaultXtype = parentAdapter['defaultTypes'] ? parentAdapter.defaultTypes[parentPropName] : null;
            config.xtype = config.xtype || defaultTypeForItems || adapterSpecificDefaultXtype || 'panel';
            if (parentPropName == 'items' || parentPropName === undefined) { //apply parent defaults if in items container or unknown
                if (parentConfig.defaults) {
                    Ext.applyIf(config, parentConfig.defaults);
                }
                //apply default transforms from the parent
                if (parentConfig.defaultTransforms) {
                    config.transforms = config.transforms || parentConfig.defaultTransforms;
                }
            }
            //process inlining of other views (triggered by xtypes that don't appear to be registered with ExtJs)
            //by nature, this can only happen when parent information is available
            var isRegistered = this.isRegistered(config.xtype);
            if (config.xtype && !isRegistered) {
                var origXtype = config.xtype;
                delete config.xtype;
                //see if it starts with bind syntax, meaning it's a placeholder for a bound sub-model
                if (origXtype && origXtype.substring(0, 2) == '@{') {
                    var expr = origXtype.substring(2, origXtype.length - 1);
                    var split = this.traverseExpression(viewmodel, expr);
                    var target = split.model[split.prop];
                    var viewname = target.viewmodelName + (config.viewMode?'_'+config.viewMode:'');
                    var spec = glu.getViewSpec(target, viewmodel.ns, viewname, config);
                    if (Ext.isString(spec))
                        throw spec;
                    //just inline the view and prepare for binding...
                    config = spec;
                    //must add actual xtype
                    config.xtype = config.xtype || defaultTypeForItems || adapterSpecificDefaultXtype || 'panel';
                    config.bindContext = expr;

                } else {
                    //see if it is a 'local type' and if so inline it
                    var spec = glu.getViewSpec(viewmodel, viewmodel.ns, origXtype, config);
                    if (!Ext.isString(spec)) {//getViewSpec returns error strings when it can't process the request. I wrote it but do not necessarily approve.
                        config = spec;
                        config.xtype = config.xtype || defaultTypeForItems || adapterSpecificDefaultXtype || 'panel';
                    } else {
                        //put it back - it will throw an exception later
                        config.xtype = origXtype;
                    }
                }
            }

        }

        //STEP 2 : Initialize the actual binding by fetching the adapter, bindContext, and transforms
        glu.log.indentMore();
        config._bindingMap = config._bindingMap || {};
        config.xtype = config.xtype || 'panel'; //default to panel if nothing else found
        glu.log.debug(glu.log.indent + 'COLLECTING bindings for {xtype: ' + config.xtype + '}');
        bindingsList = bindingsList || [];
        //first, look for conventional name binding.
        var xtypeAdapter = this.getAdapter(config);
        var transformAdapters = [];
        if (config.transforms != null) {
            //transform additional adapters...
            for (var i = 0; i < config.transforms.length; i++) {
                transformAdapters.push(this.getAdapter({
                    xtype:config.transforms[i]
                }));
            }
        }
        //global adapters...
        for (var i = 0; i < glu.plugins.length; i++) {
            transformAdapters.push(this.getAdapter({
                xtype:glu.plugins[i]
            }));
        }

        //if bindContext is specified, then offset the viewmodel to that sub model.
        if (config.hasOwnProperty('bindContext')) {
            var traversalExpression = this.traverseExpression(viewmodel, config.bindContext);
            if (traversalExpression.model[traversalExpression.prop]) {
                viewmodel = traversalExpression.model[traversalExpression.prop];
            }
        }

        //STEP 3: Invoke any 'beforeCollect' adapters or plugins, and get a new adapter if it changed the xtype
        //repeat until xtype stops changing!
        var origXtype = null;
        while (origXtype != config.xtype) {
            var origXtype = config.xtype;
            if (glu.isFunction(xtypeAdapter.beforeCollect)) {
                xtypeAdapter.beforeCollect(config, viewmodel);
            }
            for (var i = 0; i < transformAdapters.length; i++) {
                var origXtype = config.xtype;
                if (glu.isFunction(transformAdapters[i].beforeCollect)) {
                    transformAdapters[i].beforeCollect(config, viewmodel);
                }
            }
            if (origXtype !== config.xtype) {
                //the before collect routines may have changed the xtype
                xtypeAdapter = this.getAdapter(config);
            }
        }
        glu.fireEvent('beforecollect', config, viewmodel, parentPropName);


        //STEP 4: Apply any automatic conventions (supplied by adapter) based on the config.name property
        if (config.name != null && !xtypeAdapter.suppressNameBindings) {
            //automatically find the best default property to bind to when binding by name
            if (glu.isFunction(xtypeAdapter.applyConventions)) {
                //perform automatic template-based name bindings
                xtypeAdapter.applyConventions(config, viewmodel);
            }
        }

        //STEP 5: Walk all of properties of the adapter
        var childContainerPropNames = [];

        for (var propName in config) {

            if (propName === 'xtype' || propName === 'ptype' || propName === '_defaultVm'
                || propName === 'id' || propName === '_bindings' || propName === '_bindingMap'
                || (propName ==='name' && !xtypeAdapter.suppressNameBindings) || propName === 'rootVM') {
                //skip unbindable properties
                continue;
            }

            var value = config[propName];

            if (propName == 'listeners') {
                //manage listeners block which is special:
                config._bindingMap = config._bindingMap || {};
                config._bindingMap.listeners = config._bindingMap.listeners || {};
                var listeners = value;
                for (var propName in listeners) {
                    config._bindingMap.listeners[propName] = config.listeners[propName];
                    this.collectPropertyBinding(propName, config.listeners, viewmodel, true);
                }
                continue;
            }

            if (xtypeAdapter.isChildObject && xtypeAdapter.isChildObject(propName, value)) {
                //process a special single child object like a menu or toolbar
                //we check for string because it may be a binding that will get pushed down a level
                if (glu.isString(value) || glu.isArray(value)) {
                    //appears to be an array shortcut for an actual single special item like a menu or toolbar...
                    var shortcutConverter = xtypeAdapter[propName + 'Shortcut'];
                    if (shortcutConverter) {
                        value = shortcutConverter(value, config);
                        config[propName] = value;
                    }
                    if (glu.isString(value) || glu.isArray(value)) {
                        throw new Error("Failed to convert " + propName + " into a child object");
                    }
                }

                childContainerPropNames.push(propName);
                continue;
            }
            var isChildArray = xtypeAdapter.isChildArray && xtypeAdapter.isChildArray(propName);
            if ((isChildArray && glu.isArray(value))) {
                //process a child array (like items or dockedItems), only if actually an array.
                //if a binding to a list, then simply collect the binding
                childContainerPropNames.push(propName);
                continue;
            }

            //By convention established by ExtJS, anything that ends with a "handler"
            //is a special shortcut event listener
            var isEventListener = propName == 'handler' || glu.symbol(propName).endsWith('Handler');

            //Finally, process this individual property binding
            this.collectPropertyBinding(propName, config, viewmodel, isEventListener, isChildArray, xtypeAdapter);
        }

        if (glu.isFunction(xtypeAdapter.beforeCollectChildren)) {
            xtypeAdapter.beforeCollectChildren(config, viewmodel);
        }

        //STEP 6: Walk child objects
        function bindChildren() {
            for (var idx = 0; idx < childContainerPropNames.length; idx++) {
                var childContainerPropName = childContainerPropNames[idx];
                var childContainer = config[childContainerPropName];
                if (Ext.isArray(childContainer)) {
                    var newItems = [];
                    for (var i = 0; i < childContainer.length; i++) {
                        var childItem = childContainer[i];
                        var result = this.collectBindings(childItem, viewmodel, config, childContainerPropName, xtypeAdapter, bindingsList, indents + 1);
                        newItems.push(result.config);
                    }
                    config[childContainerPropName] = newItems;
                } else {
                    //otherwise do a simple recursion
                    config[childContainerPropName] = this.collectBindings(childContainer, viewmodel, config, childContainerPropName, xtypeAdapter, bindingsList, indents + 1).config;
                }
            }
        }

        //do the actual child walk
        bindChildren.apply(this);

        //STEP 7: Call any beforeCreate on the adapter (now that the config is all prepared)
        if (glu.isFunction(xtypeAdapter.beforeCreate)) {
            xtypeAdapter.beforeCreate(config, viewmodel);
        }

        for (var i = 0; i < transformAdapters.length; i++) {
            if (glu.isFunction(transformAdapters[i].beforeCreate)) {
                var upshot = transformAdapters[i].beforeCreate(config, viewmodel) || {};
                //sometimes in rare case a transformer will need to rebind the children after a radical change
                if (upshot.rebindChildren) {
                    bindChildren.apply(this);
                }
            }
        }

        //STEP 8: add the 'afterCreate' plugin from the adapter to the ExtJS control to
        //"normalize" the control on creation. DOES NOT APPLY BINDING, just "converts" ExtJS control
        //to glu control as needed without affecting ExtJS prototypes or creating new widgets
        if (!(config.plugins && config.plugins.addedBinderPlugin)) {
            if (Ext.getProvider().provider == 'touch') {
                config.plugins = config.plugins || [];
                config.plugins.addedBinderPlugin = true;
                Ext.define('Ext.plugin.' + xtypeAdapter.name + 'Plugin', {
                    isBinderPlugin:true,
                    alias:'plugin.' + xtypeAdapter.name + 'Plugin',
                    //xtype:'Ext.plugin.adapterPlugin',
                    init:function (control) {
                        if (glu.isFunction(xtypeAdapter.afterCreate)) {
                            xtypeAdapter.afterCreate(control, viewmodel);
                        }
                        for (var i = 0; i < transformAdapters.length; i++) {
                            var tAdapter = transformAdapters[i];
                            if (glu.isFunction(tAdapter.afterCreate)) {
                                tAdapter.afterCreate(control, viewmodel);
                            }
                        }
                    }
                });
                config.plugins.push(xtypeAdapter.name + 'Plugin');

            }
            else {
                config.plugins = config.plugins || [];
                config.plugins.addedBinderPlugin = true;
                config.plugins.push({
                    isBinderPlugin:true,
                    init:function (control) {
                        if (glu.isFunction(xtypeAdapter.afterCreate)) {
                            xtypeAdapter.afterCreate(control, viewmodel);
                        }
                        for (var i = 0; i < transformAdapters.length; i++) {
                            var tAdapter = transformAdapters[i];
                            if (glu.isFunction(tAdapter.afterCreate)) {
                                tAdapter.afterCreate(control, viewmodel);
                            }
                        }
                    }
                });
            }
        }

        //STEP 9: Store the binding in the list and return
        if (config._bindings != null && config._bindings.length > 0) {
            config.id = config.id || Ext.id(null,'glu-' + config.xtype + '-');
            config._bindings.defaultModel = viewmodel;
            config._bindings.adapter = xtypeAdapter;
            bindingsList.push(config);
        }
        glu.log.indentLess();
        return {
            config:config,
            bindings:bindingsList
        }
    },

    /*
     * Collect and activate property binding on the config
     */
    collectPropertyBinding:function (propName, config, viewmodel, isEventListener, isChildArray, xtypeAdapter) {
        var propValue = config[propName];
        var binding = this.readPropertyBinding(propValue, viewmodel, isEventListener);
        if (binding == null) {
            return; //nothing to do
        }
        if (binding.localizationKey) {
            //just a localization, no need to store
            config[propName] = binding.initialValue;
            return;
        }
        binding.controlPropName = propName;
        if (!binding.valid) {
            if (binding.reason.indexOf('Syntax ') > -1) {
                throw new Error('Binding Exception - ' + binding.reason);
            }
            if (binding.optional) {
                delete config[propName];
                return;
            }
            if (binding.reason == 'Missing bind target') {
                throw new Error('Binding Exception - The control config property "' + propName +
                    '" is non-optionally bound to view model property "' +
                    propValue + '" but that target does not exist.');
            }
            if (binding.reason == 'Illegal function binding') {
                throw new Error("Binding Exception: " + 'Attempted to bind config property "' + propName + '" to a function when "'
                    + propName + '" is not a handler or listener.');
            }
            throw new Error('Binding Exception: ' + binding.reason);
        }
        if (isEventListener) {
            //simply provides the signature of the event minus
            //the first argument (which is always the control itself)
            binding.initialValue = function () {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                //remove the first element
                if (config.value) {
                    //if there is a value, put that first in the list
                    args.unshift(config.value);
                }
                glu.log.info(glu.symbol('USER triggered {0}.{1}').format(binding.model.toString(), binding.modelPropName));
                binding.model[binding.modelPropName].apply(binding.model, args);
            };
            config[binding.controlPropName] = binding.initialValue;
            return;
        }

        if (binding.initialValue && isChildArray) {
            //don't actually want it being initialized with a bunch of view/data/whatever models!
            //These will be added later by the item binder
            binding.initialValue = [];
        }

        //transform initial value if requested by adapter
        if (xtypeAdapter) {
            var propBindings = xtypeAdapter[binding.controlPropName + 'Bindings'];
            if (propBindings && propBindings.transformInitialValue) {
                binding.initialValue = propBindings.transformInitialValue(binding.initialValue, config, binding.model);
            }
        }

        //set initial value
        config[binding.controlPropName] = binding.initialValue;

        //track that the binding occurred (for a sanity check, not otherwise used)
        config._bindings = config._bindings || [];
        if (config._bindingMap) {
            config._bindingMap[propName] = propValue;
        }

        //If this is more than a one-time binding on initialization, store it for later
        if (!binding.onetime) {
            config._bindings.push(binding);
        }
    },

    /* DOCS DISABLED FOR NOW
     * Simply collect a binding without actually activating it on the configuration
     */
    readPropertyBinding:function (propValue, viewmodel, isEventListener) {
        var binding = glu.parseBindingSyntax(propValue);
        if (binding == null || !binding.valid) {
            return binding;
        }
        binding = Ext.apply(binding, {
            model:viewmodel,
            invertValue:false,
            initialValue:null
        });
        //DETECT IF the whole expression is a locale key. Assume it begins and ends with those delimiters.
        if (binding.localizationKey) {
            binding.initialValue = glu.localize({
                viewmodel:binding.model,
                ns:viewmodel.ns,
                key:binding.localizationKey
            });
            return binding;
        }

        var bindExpression = binding.bindExpression;

        //VERY SIMPLE EXPRESSION PROCESSING
        //Starts with not "!" ?
        if (bindExpression.indexOf('!') == 0) {
            binding.invertValue = true;
            bindExpression = bindExpression.substring(1);
        }
        if (bindExpression.substring(0, glu.conventions.windowPath.length) == glu.conventions.windowPath) {
            bindExpression = bindExpression.substring(glu.conventions.windowPath.length);
            var traversed = this.traverseExpression(window, bindExpression);
            binding.model = traversed.model;
            bindExpression = traversed.prop;
        } else if (bindExpression.indexOf(glu.conventions.autoUp) > -1) {
            bindExpression = bindExpression.substring(glu.conventions.autoUp.length);
            binding.model = this.traverseUpExpression(binding.model, bindExpression);
        } else
        //is there a traversal
        if (bindExpression.indexOf('\.') > -1) {
            var traversed = this.traverseExpression(binding.model, bindExpression);
            binding.model = traversed.model;
            bindExpression = traversed.prop;
        }
        binding.modelPropName = bindExpression;
        binding.initialValue = binding.model.get ? binding.model.get(bindExpression) : binding.model[bindExpression];

        if (binding.initialValue === undefined && !binding.model.hasOwnProperty(bindExpression)) {
            binding.valid = false;
            binding.reason = 'Missing bind target';
            return binding;
        }
        if (isEventListener) {
            return binding; //nothing more to do at this point...
        }

        if (Ext.isFunction(binding.initialValue)) {
            binding.valid = false;
            binding.reason = "Illegal function binding";
        }

        //make substitution:
        if (binding.invertValue) {
            binding.initialValue = !binding.initialValue;
        }
        if (binding.isFormula) {
            binding.initialValue = binding.prefix + binding.initialValue + binding.suffix;
        }
        return binding;
    },

    traverseExpression:function (model, expression) {
        var tokens = expression.split('\.');
        var actualModel = model;
        for (var i = 0; i < tokens.length - 1; i++) {
            var token = tokens[i];
            var child = actualModel.get ? actualModel.get(token) : actualModel[token];
            if (child === undefined) {
                throw new Error("Unable to find child '" + token + "' within expression '" + expression + "'");
            }
            actualModel = child;
        }
        return {
            model:actualModel,
            prop:tokens[tokens.length - 1]
        }
    },

    traverseUpExpression:function (model, expression) {
        var foundModel = model;
        do {
            var hasProp = foundModel.hasOwnProperty(expression);
            if (hasProp)
                break;
            foundModel = foundModel.parentVM;
        } while (foundModel != null);

        return foundModel || model;
    }
});
