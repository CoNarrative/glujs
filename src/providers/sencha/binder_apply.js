/*
 * Copyright (C) 2012 by CoNarrative
 */
Ext.ns('glu.provider.binder');
Ext.apply(glu.provider.binder, {
    /*
     * Receives an array of bindings and attaches them appropriately
     */
    applyBindingsList:function (configList) {
        for (var i = 0; i < configList.length; i++) {
            var config = configList[i];
            this.applyAllBindingsToAControl(config);
        }
    },

    applyAllBindingsToAControl:function (config) {
        if (!config.hasOwnProperty('_bindings')) {
            return; //has no bindings
        }
        var control = Ext.getCmp(config.id);
        var bindingAdapter = config._bindings.adapter;
        if (control === undefined) {
            if (bindingAdapter.findControl) {
                control = bindingAdapter.findControl(config);
            }
            if (control === undefined) {
                glu.log.warn('unable to find and apply bindings to control ' + config.id);
                return;
            }
        }
        if (control._private != null && control._private.isBound == true) {
            return; //already bound
        }
        glu.log.indentMore();
        glu.log.debug(glu.log.indent + 'APPLYING bindings for {xtype: ' + control.xtype + '}');

        control._private = control._private || {};
        control._private.isBound = true;

        new glu.GraphObservable({node:control});
        control._vm = config._bindings.defaultModel; //the defaultModel is the directly bound model
        control.on('destroy', function(cntrl){
            cntrl._ob.detach('_vm'); //informs the view model list to stop sending me events
        });
        var bindings = config._bindings;
        for (var i = 0; i < bindings.length; i++) {
            var binding = bindings[i];
            this.applyOneBindingToControl(bindingAdapter, config, control, binding);
        }
        if (control.fireEvent) {
            control.fireEvent('glubind', control);
        }
        glu.log.indentLess();
    },

    applyOneBindingToControl:function (bindingAdapter, config, control, binding) {
        var propBindings = bindingAdapter[binding.controlPropName + 'Bindings'] || {};

        if (propBindings && glu.isFunction(propBindings.custom)) {
            var handledCustom = propBindings.custom({
                binding:binding,
                config:config,
                viewmodel:binding.model,
                control:control
            });
            if (!(handledCustom === false)) {
                return;
            }
        }
        //MODEL -> CONTROL
        if (binding.model.on != null) {//only listen to model when model is observable
            this.applyPropBindingToControl(bindingAdapter, config, binding.model, control, binding, propBindings);
        }

        // MODEL -> CONTROL IS FINISHED.
        if (propBindings && propBindings.onInit) {
            propBindings.onInit.call(binding.model, binding, control);
        }

        // CONTROL -> MODEL
        if (propBindings === undefined || propBindings.suppressViewmodelUpdate || propBindings.eventName === undefined) {
            //can't bind from control -> model because control property doesn't surface any behavior to user
            return;
        }

        glu.log.debug('LISTENING on control property ' + propBindings.eventName);

        control.on(propBindings.eventName, function () {
            var adaptedValue = propBindings.eventConverter.apply(bindingAdapter, arguments);
            if (binding.invertValue) {
                adaptedValue = !adaptedValue;
            }
            glu.log.info(glu.symbol('USER changed {0}.{1}').format(binding.model.toString(), binding.modelPropName));
            binding.model.set.call(this, binding.modelPropName, adaptedValue);
        }, binding.model);

    },

    /**
     * Adds a listener to a particular view model property that will push into a control
     * The reference to the control is entirely weak and by control ID, so that nowhere do we hold on
     * to a reference to an ExtJS component (to minimize inadvertent memory leaks)
     * @private
     * @param bindingAdapter
     * @param config
     * @param viewmodel
     * @param theControl
     * @param binding
     * @param propBindings
     */
    applyPropBindingToControl:function (bindingAdapter, config, viewmodel, theControl, binding, propBindings) {
        // if glu.testMode then store a reference to the control within the view model
        //TODO: Make sure registerCOntrolBinding just hands in Id
        if (glu.testMode) {
            viewmodel.registerControlBinding(binding.modelPropName, theControl);
        }

        var modelEventName = binding.modelPropName + 'Changed';
        glu.log.debug('binding model event name of ' + modelEventName);

        var controlId = theControl.id;
        var valueSetter = propBindings.setComponentProperty;
        if (valueSetter === undefined) {//default to the form 'control.setFoo(value)', where foo is the name
            var setterName = 'set' + glu.string(binding.controlPropName).toPascalCase();
            var testSetter = theControl[setterName];
            if (testSetter === undefined) {
                glu.log.debug('Attempted to bind non-existent value setter "' + setterName + '" on xtype: ' + theControl.xtype);
                return;
            }
            valueSetter = function (value, oldValue, options, control) {
                control[setterName].call(control, value);
            };
        }

        var storeInControlAs = propBindings.storeValueInComponentAs || binding.controlPropName;
        var wrapper = function (value, oldValue, options) {
            var control = Ext.getCmp(controlId);
            if (control===undefined) {
                if (bindingAdapter.findControl) {
                    control = bindingAdapter.findControl(config);
                }
                if (control === undefined) {
                    return 'discard';
                }
            }
            if (glu.isArray(value)){
                //make a copy--arrays are handled by equivalence not reference
                value = value.slice();
            }
            if (binding.invertValue) {
                value = !value;
            }
            if (binding.isFormula) {
                value = binding.prefix + value + binding.suffix;
            }
            if (glu.equivalent(control[storeInControlAs], value)) {
                glu.log.debug('suppressing set of property ' + binding.controlPropName + ' on control as it already has value->' + value);
                return; //suppress - already set to that value. This control could have been the originator of the model change in fact.
            }
            //TODO - Simply save oldvalue instead of recalculating...
            if (binding.invertValue) {
                oldValue = !oldValue;
            }
            if (binding.isFormula) {
                oldValue = binding.prefix + oldValue + binding.suffix;
            }
            glu.log.debug('setting control property "' + binding.controlPropName + '" to "' + value + '"');
            glu.updatingUI();
            valueSetter(value, oldValue, options, control);
            //set the underlying field as a tracker
            control[storeInControlAs] = value;
        };

        glu.log.debug('LISTENING on viewmodel property ' + modelEventName);

        viewmodel.on(modelEventName, wrapper, viewmodel);

        //TODO: Switch to this format ASAP so we can start properly detaching views from their view models for when view models switch contexts
//        theControl._ob.on('_vm.' + modelEventName, wrapper, viewmodel);
    }
});
