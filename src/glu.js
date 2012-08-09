/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu
 * Core library class for GluJS
 * @singleton
 */
if (window.glu != null) {
    window.gluProvider = glu.provider;
}

glu = {
    /*
     * * @cfg {Function} handler
     */
    testMode:false,
    mtypeRegistry:{},
    bindingDirectiveRegistry:{},
    /**
     * Creates a view model and the associated view
     * @param {Object} view model config
     * @return {Object} the created view
     */
    createViewmodelAndView:function (config, asWindow) {
        var vm;
        if (config._private && config._private.isInstantiated) {
            vm = config;
        } else {
            vm = glu.model(config);
        }

        var viewSpec = this.getViewSpec(vm);
        if (glu.isString(viewSpec)) throw viewSpec;
        vm.init();
        if (asWindow) {
            if (viewSpec.asWindow) {
                viewSpec = glu.deepApply({
                    xtype:'window',
                    layout:'fit',
                    items:[viewSpec]
                }, viewSpec.asWindow);
            } else {
                viewSpec.xtype = 'window';
            }
        }
        var view = glu.viewFromSpec(vm, viewSpec);
        return view;
    },

    splitNs:function (vmName) {
        var parts = vmName.split('.');
        return {
            className:parts[parts.length - 1],
            namespace:parts.slice(0, parts.length - 1).join('.')
        };
    },

    /*
     * Fetches a fully configured view from a name specification readied for binding and view creation
     * Returns an error string if could not process it.
     */
    getViewSpec:function (vm, ns, viewmodelName, configOverlay, defaults) {
        ns = ns || vm.ns;
        viewmodelName = viewmodelName || vm.viewmodelName;
        configOverlay = configOverlay || {};
        var viewName = viewmodelName;
        glu.log.info('Creating view ' + ns + '.' + viewName);
        var nsSubObj = glu.namespace(ns + '.' + glu.conventions.viewNs);
        var viewSpec = nsSubObj[viewName];
        if (!viewSpec) {
            var factory = nsSubObj[viewName + 'Factory'];
            if (factory === undefined) {
                return 'unable to find view config spec for ' + viewName;
            }
            configOverlay.vm = vm;
            viewSpec = factory(configOverlay);
            delete configOverlay.vm;
        } else {
            //TODO: Switch to making a prototype versus mixing properties in as
            //that level of dynamism has not proven to be necessary
            viewSpec = glu.deepApply({}, viewSpec);
        }
        if (viewSpec.parentLayout) {
            var layoutName = viewSpec.parentLayout;
            var layoutFactory = nsSubObj[layoutName + 'Factory']; //has to be a factory
            if (layoutFactory === undefined) return "Could not find parent layout " + layoutName;
            viewSpec.vm = vm;
            viewSpec = layoutFactory(viewSpec);
            delete viewSpec.vm;
            if (viewSpec === undefined) return "Expected layout factory " + layoutName + " to return a view specification";
        }
        if (configOverlay) {
            glu.apply(viewSpec, configOverlay);
        }
        if (defaults) {
            glu.applyIf(viewSpec, defaults);
        }
        return viewSpec;
    },

    /*
     * Initializes a view off of a view model.
     * @param {glu.ViewModel} viewmodel
     * @return {glu.view} The created view
     */
    view:function (vm, ns, className, configOverlay, defaults, parent) {
        var viewSpec = this.getViewSpec(vm, ns, className, configOverlay, defaults, parent);
        if (glu.isString(viewSpec)) throw viewSpec;
        var view = glu.viewFromSpec(vm, viewSpec, parent);
        return view;
    },

    /**
     * A factory function for creating a view once the view config has already been supplied.
     * @private
     * @param {Object} vm The view model bound to this view
     * @param {Object} viewSpec The configuration for the view
     * @return {Object}
     */
    viewFromSpec:function (vm, viewSpecBase, parent) {
        var viewSpec = viewSpecBase;
        //WARNING: Does not make copy, assume viewspec is writable (should have already been cloned if from template)
        //glu.deepApply(viewSpec, viewSpecBase); //always pass in a copy...
        var view = glu.provider.view(vm, viewSpec, parent);
        view._bindings = view._bindings || [];
        view._bindings.viewmodel = vm;
        return view;
    },

    /**
     * Locate a glu provider component.
     * @param {String} id The id of the component to locate
     * @return {Object}
     */
    getCmp:function (id) {
        return glu.provider.getCmp(id);
    },
    S4:function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    /**
     * Generate a guid.
     * @param {String} prefix An optional prefix to start the guid with.
     * @return {String}
     */
    guid:function (prefix) {
        return ((prefix ? prefix : 'a') + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4());
    },
    /**
     * Returns true if the passed value is a JavaScript array, otherwise false.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isArray:function (value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    },
    /**
     * Returns true if the passed value is a JavaScript Object, otherwise false.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isObject:function (target) {
        //return typeof(target)=='object';
        return !!target && Object.prototype.toString.call(target) === '[object Object]';
    },
    /**
     * Returns true if the passed object is a JavaScript date object, otherwise false.
     * @param {Object} object The object to test
     * @return {Boolean}
     */
    isDate:function (value) {
        return Object.prototype.toString.apply(value) === '[object Date]';
    },
    /**
     * Returns true if the passed value is a JavaScript Function, otherwise false.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isFunction:function (target) {
        return typeof(target) == 'function';
    },
    /**
     * Returns true if the passed value is a string.
     * @param {Mixed} value The value to test
     * @return {Boolean}
     */
    isString:function (target) {
        return typeof(target) == 'string';
    },

    isNumber:function (target) {
        return typeof(target) == 'number';
    },

    namespaces:{},
    /**
     * Creates namespace to be used for scoping variables and classes so that they are not global.
     * Specifying the last node of a namespace implicitly creates all other nodes. Usage:
     * <pre><code>
     Ext.namespace('company.app1')
     company.app1.Widget = function() { ... }
     </code></pre>
     * @param {String} namespace
     * @return {Object} The namespace object.
     */
    namespace:function (str) {
        //if (this.namespaces[str]) return this.namespaces[str];

        var tokens = str.split('\.');
        var root = window;
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var existingChild = root[token];
            if (existingChild === undefined) {
                existingChild = {};
                root[token] = existingChild;
            }
            root = existingChild;
        }
        this.namespaces[str] = root;
        return root;
    },

    /**
     *  Walks a long object path (foo.bar.prop) without using eval to find the value at the end.
     *  Unlike namespace will not create the path if it does not exist
     *  @return {Object} the path, or null if it doesn't exist
     */
    walk:function (str, root) {
        if (str==null) return null;
        var tokens = str.split('\.');
        root = root || window;
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var existingChild = root[token];
            if (existingChild === undefined) {
                return null;
            }
            root = existingChild;
        }
        return root;
    },

    /**
     * Copies all the properties of config to obj.
     * @param {Object} target The receiver of the properties
     * @param {Object} src The source of the properties
     * @param {Object} defaults A different object that will also be applied for default values
     * @return {Object} returns target
     */
    apply:function (obj, config, defaults) {
        return glu.provider.apply(obj, config, defaults);
    },

    /**
     * Copies all the properties of config to obj, skipping if the property already exists on the target.
     * @param {Object} target The receiver of the properties
     * @param {Object} src The source of the properties
     * @param {Object} defaults A different object that will also be applied for default values
     * @return {Object} returns target
     */
    applyIf:function (obj, config, defaults) {
        return Ext.applyIf(obj, config, defaults);
    },

    /**
     * Deep clones an object property by property from a source to a target
     * @param target
     * @param src
     * @param noOverwrite
     * @return {Object} the target
     */
    deepApply:function (target, config, noOverwrite) {
        for (var propName in config) {
            var propValue = config[propName];
            if (glu.isObject(propValue) &&
                propName !== "parentVM" && //parent view model
                propName !== 'rootVM' && //root view model
                propName !== 'parentList' && //parent list
                propName !== 'meta' && //don't remember
                propName !== 'ownerCt' &&
                !(propValue._private) //make sure this isn't a glu object
                )
            {
//                if (propValue.constructor!==Object.prototype.constructor) {
//                    debugger;
//                    throw 'Please only use raw objects to configure a view or view model, not other glu objects';
//                }
                target[propName] = target[propName] || {};
                glu.deepApply(target[propName], propValue, noOverwrite);
                continue;
            }
            if (noOverwrite && target.hasOwnProperty(propName)) continue;
            if (glu.isArray(propValue)) {
                var newArray = [];
                for (var i = 0; i < propValue.length; i++) {
                    var item = propValue[i];
                    if (glu.isObject(item)) {
                        var newtarget = {};
                        glu.deepApply(newtarget, item, noOverwrite);
                        newArray.push(newtarget);
                    } else {
                        newArray.push(item);
                    }
                }
                target[propName] = newArray;
                continue;
            }
            //primitive or function
            target[propName] = propValue;
        }
        return target;
    },

    /**
     * Deep clones an object property by property from a source to a target, skipping if the target property exists
     * @param target
     * @param src
     * @param noOverwrite
     * @return {Object} the target
     */
    deepApplyIf:function (obj, config) {
        return glu.deepApply(obj, config, true)
    },
    /*
     * Mixins or Traits are object snippets with properties and behavior that are added into an object
     * Unlike extjs plugins, they are parameterless and have a correctly scoped 'this' on initialization
     * In other words, they really are "mixed in" to the javascript object
     * This eliminates much of the syntactic cruft of trying to make javascript 'object-oriented'
     * While still giving the same basic feel
     * Mixins are the preferred way to go when you can do it as it makes things very simple...
     */
    traitReg:{},

    regTrait:function (name, trait) {
        this.traitReg[name] = trait;
    },

    mixin:function () {
        var target = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            this.mixinSingleTrait(target, arguments[i]);
        }
    },

    mixinSingleTrait:function (target, traitName) {
        glu.log.info('asked to mixin trait ' + traitName);
        if (!glu.isString(traitName)) {
            throw "You must pass in the short string name of the trait, not the trait itself";
        }
        if (target.traits === undefined) {
            target.traits = {};
        }
        if (target.traits[traitName] != null) {
            return;
        }

        var trait = new this.traitReg[traitName];
        if (trait === undefined) {
            throw "no such trait '" + traitName + "' exists";
        }

        if (trait.requiresTrait != null) {
            glu.log.info('processing ' + trait.requiresTrait.length + ' requirements');
            for (var i = 0; i < trait.requiresTrait.length; i++) {
                var traitRef = trait.requiresTrait[i];
                this.mixin(target, traitRef);
            }
        }
        //apply everything...


        var stripped = glu.apply({}, trait); //clone
        var initTrait = stripped.initTrait; //some traits have an initializer
        delete stripped.initTrait; //don't mixin the init funciton!
        delete stripped.requiresTrait;
        this.apply(target, trait);
        glu.log.info(initTrait);
        if (initTrait != null) {
            initTrait.call(target);
        }
        target.traits[trait] = true;
    },
    mreg:function (mtype, constructor) {
        this.mtypeRegistry[mtype] = constructor;
    },

    localizer:function (config) { //logic is not exposed for now
        var nsGlobal = glu.namespace(config.ns + '.' + glu.conventions.localeNs);
        if (nsGlobal === undefined) throw 'Could not find locale for namespace ' + config.ns;
        var viewSpecific = config.viewmodel ? (nsGlobal[config.viewmodel.viewmodelName] || nsGlobal[config.viewmodel.recType] || {}) : {};
        var key = config.key;
        var value = viewSpecific[key] ||
            nsGlobal[key] ||
            glu.conventions.asLocaleKey(key);
        if (value.indexOf('{') > -1) {
            value = glu.string(value).format(config.params, config.viewmodel);
        }
        return value;
    },

    /**
     * Localizes based on either simple key lookup or with an array of parameters
     * @param config
     *  @param ns
     *  @param viewmodel
     *  @param params
     * @return {*}
     */
    localize:function (key, cfg) {
        if (glu.isObject(key)) {
            cfg = key;
        } else {
            cfg.key = key;
        }
        if( cfg.key.indexOf(glu.conventions.localizeStart) == 0 && glu.symbol(cfg.key).endsWith(glu.conventions.localizeEnd) ){
            cfg.key = cfg.key.substring(glu.conventions.localizeStart.length, cfg.key.length - glu.conventions.localizeEnd.length);
        }
        cfg.ns = cfg.ns || cfg.viewmodel.ns;
        cfg.params = cfg.params || {};
        return this.localizer(cfg);
    },

    /**
     * Sets the default localizer
     * @param fn The localize function (see localize for its signature)
     */
    setLocalizer:function (fn) {
        this.localizer = fn;
    },
    confirm:function (title, message, fn, scope) {
        return glu.provider.confirm(title, message, fn, scope);
    },
    message:function (title, message, fn, scope) {
        return glu.provider.message(title, message, fn, scope);
    },

    /**
     * Registers a GluJS view adapter
     * @param name {String} the name of the adapter (the xtype if a component adapter)
     * @param adatper {Object} the adapter definition
     */
    regAdapter:function (name, adapter) {
        return glu.provider.regAdapter(name, adapter);
    },
    regBindingDirective:function (name, bindingDirective) {
        this.bindingDirectiveRegistry[name] = bindingDirective;
    },

    /*
     *         @{foo} //bind to foo if available, throw exception if cannot find
     *         @?{foo} //bind to foo if available, ignore if not
     *         @{!foo} //bind to inverse of foo if a boolean
     *        I am @{foo}; hear me roar //make a string substitution
     *         @>{foo} //oneway binding from model to view, do not track view back to model
     *         @1{foo} //bind one-time but do not track changes to foo
     */
    parseBindingSyntax:function (bindingString) {
        if (!glu.isString(bindingString)) {
            return null; //not a binding
        }
        if ((bindingString.indexOf(glu.conventions.startDelimiter) == -1 && bindingString.indexOf(glu.conventions.localizeStart) == -1)) {
            return null; //not using bind syntax and not using localization
        }
        if ((bindingString.indexOf(glu.conventions.endDelimiter) == -1 && bindingString.indexOf(glu.conventions.localizeEnd) == -1)) {
            return {
                valid:false,
                bindExpression:bindingString,
                reason:'Syntax Error: Missing closing delimiter'
            };
        }
        var results = null;

        if (bindingString.indexOf(glu.conventions.localizeStart) == 0) {
            return {
                valid:true,
                bindExpression:bindingString,
                localizationKey:bindingString.substring(glu.conventions.localizeStart.length, bindingString.length - glu.conventions.localizeEnd.length)
            };
        }

        var boundObjectRegx = new RegExp(glu.conventions.bindingSymbol + "(.*?)\\" + glu.conventions.startDelimiter);
        var boundObjectResults = bindingString.match(boundObjectRegx);
        if (glu.isArray(boundObjectResults) && boundObjectResults.length > 0) {
            var directive = boundObjectResults[boundObjectResults.length - 1];
            if (!directive) {
                directive = 'tocontrol';
            }
            for (var k in this.bindingDirectiveRegistry) {
                var symbols = this.bindingDirectiveRegistry[k].symbols;
                for (var i = 0; i < symbols.length; i++) {
                    if (symbols[i] == directive) {

                        results = glu.apply({valid:true}, this.bindingDirectiveRegistry[k]);

                        var directiveRegx = new RegExp("\\" + glu.conventions.startDelimiter + "(.*?)\\" + glu.conventions.endDelimiter);
                        var directiveResults = bindingString.match(directiveRegx);
                        if (glu.isArray(directiveResults) && directiveResults.length > 0) {
                            results.bindExpression = directiveResults[directiveResults.length - 1];
                        }
                        results.isFormula = false;
                        var startDelimiterLocation = bindingString.indexOf(glu.conventions.bindingSymbol);
                        var endDelimiterLocation = bindingString.indexOf(glu.conventions.endDelimiter);
                        if (startDelimiterLocation > 0 || endDelimiterLocation < bindingString.length - glu.conventions.endDelimiter.length) {
                            //it's a 'inline string.format'
                            //ONLY SUPPORT A SINGLE PROPERTY for now...
                            results.isFormula = true;
                            results.prefix = bindingString.substring(0, startDelimiterLocation);
                            results.suffix = bindingString.substring(endDelimiterLocation + 1);
                        }
//                        console.log(glu.provider.json.stringify(results));
                        return results;
                    }
                }
            }

        }
        return results;
    },
    openWindow:function (config) {
        return glu.provider.openWindow(config);
    },
    /**
     * Creates a glu ViewPort
     */
    viewport : function(config){
        return glu.provider.viewport(config);
    },
    panel:function () {
        return glu.provider.panel.apply(glu.provider, arguments);
    },
    equivalent:function (oldVal, newVal) {
        if ((oldVal === null && newVal != null) || (oldVal != null && newVal == null)) return false;
        if (glu.isObject(newVal) || glu.isArray(newVal)) {
            if (newVal == oldVal) {//by reference
                return true;
            }
            //do comparison?
//            try {
//                return JSON.stringify(oldVal) == JSON.stringify(newVal);
//            } catch (excp) {
//                return false; //if cannot stringify, then does not count...
//            }
        }
        return oldVal === newVal;
    },
    setTestMode:function () {
        this.testMode = true;
    },

    validations:{
        notEmpty:function (prop) {
            return function () {
                var val = this.get(prop);
                if (val == null || val == '') {
                    return 'This field is required.';
                }
                return true;
            }
        }
    },

    widget:function (config) {
        return glu.provider.widget(config);
    },

    _splitReference:function (fqname) {
        var splitAt = fqname.lastIndexOf('\.');
        if (splitAt === -1) {
            throw "Reference '" + fqname + "' requires a namespace";
        }
        return {
            ns:fqname.substring(0, splitAt),
            name:fqname.substring(splitAt + 1)
        };
    },
    def:function (fqname, config, location) {
        var capture = this._splitReference(fqname, config, location);
        var nsObj = glu.ns(capture.ns + '.' + location);
        nsObj[capture.name] = config;
    },

    /**
     * Defines a view model (see Glu.ViewModel)
     *
     * @param {String} fqname The name of the view model
     * @param {Object} config The view model configuration
     *
     */
    defModel:function (fqname, config) {
        this.def(fqname, config, glu.conventions.viewmodelNs);
    },

    /**
     * Defines a view according to the provider (e.g. ExtJS) using the provider's declarative JSON syntax
     * @param {String} fqname The name of the view
     * @param {String} viewmode (optional) Indicates the mode of this view
     * @param {String} config The declarative configuration of the view
     */
    defView:function (fqname, viewmode, config) {
        if (glu.isString(viewmode)){
            fqname = fqname + '_' + viewmode;
        } else {
            config = viewmode;
        }
        this.def(fqname, config, glu.conventions.viewNs);
    },

    extend:function (baseConstructor, classDef) {
        var constructor = classDef.constructor === Object ? function () {
            baseConstructor.apply(this, arguments);
        } : classDef.constructor;
        //dummy function to serve as temporary constructor so that we don't invoke actual base constructor until parent constructor chooses
        var tempBaseConstructor = function () {
        };
        tempBaseConstructor.prototype = baseConstructor.prototype;
        constructor.prototype = new tempBaseConstructor();
        //for chaining within the child constructor function
        constructor.superclass = baseConstructor.prototype;
        constructor.prototype.constructor = constructor;
        delete classDef.constructor;
        glu.apply(constructor.prototype, classDef);
        return constructor;
    },

    define:function (name, classDef) {
        var baseCls = glu.walk(classDef.extend) || function(){};
        var cls = glu.extend (baseCls, classDef);
        var ref = glu._splitReference(name);
        glu.walk(ref.ns)[ref.name] = cls;
        return cls;
    },

    getDataTypeOf:function (value) {
        if (glu.isString(value)) {
            type = 'string';
        }
        else if (glu.isNumber(value)) {
            type = 'int';
        }
        else if (Ext.isBoolean(value)) {
            type = 'boolean';
        }
        else if (glu.isObject(value)) {
            type = 'object';
        }
        else if (Ext.isDate(value)) {
            type = 'date';
        }
        return type;
    },

    plugin : function(name) {
        this.plugins.push(name);
    },

    plugins:[]
};


if (window.gluProvider != null) {
    glu.provider = gluProvider;
    try {
        delete gluProvider;
    } catch (e) {
        gluProvider = null;
    }
}

glu.ns = glu.namespace; //alias

//register the "empty" panel that can be configured at run time.
if (Ext.getProvider().provider != 'touch') {
    glu.panel('glupanel', {});
}



