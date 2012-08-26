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

        //add an observer! There shouldn't be one until now...
        new glu.GraphObservable({node:control});

        var bindings = config._bindings;
        for (var i = 0; i < bindings.length; i++) {
            var binding = bindings[i];
            this.applyOneBindingToControl(bindingAdapter, config, control, binding);
        }
        glu.log.indentLess();
    },

    applyOneBindingToControl:function (bindingAdapter, config, control, binding) {
        var propBindingAdapter = bindingAdapter[binding.controlPropName + 'Bindings'] || {};
        if (propBindingAdapter && glu.isFunction(propBindingAdapter.custom)) {
            var handledCustom = propBindingAdapter.custom({
                binding:binding,
                config:config,
                viewmodel:binding.getModel(),
                control:control
            });
            if (!(handledCustom === false)) {
                return;
            }
        }
        //MODEL -> CONTROL
        if (binding.localModel.on != null) {//only listen to model when model is observable
            this.applyPropBindingToControl(bindingAdapter, config, control, binding, propBindingAdapter);
        }

        // MODEL -> CONTROL IS FINISHED.
        if (propBindingAdapter && propBindingAdapter.onInit) {
            propBindingAdapter.onInit.call(binding.getModel(), binding, control);
        }

        // CONTROL -> MODEL
        if (propBindingAdapter === undefined || propBindingAdapter.suppressViewmodelUpdate || propBindingAdapter.eventName === undefined) {
            //can't bind from control -> model because control property doesn't surface any behavior to user
            return;
        }

        glu.log.debug('LISTENING on control property ' + propBindingAdapter.eventName);

        control.on(propBindingAdapter.eventName, function () {
            var adaptedValue = propBindingAdapter.eventConverter.apply(bindingAdapter, arguments);
            if (binding.invertValue) {
                adaptedValue = !adaptedValue;
            }
            var model = binding.getModel(); //always get the *currently referenced* view model
            model.set.call(model, binding.modelPropName, adaptedValue);
        });

    },

    /**
     * Adds a listener to a particular view model property that will push into a control
     * The reference to the control is entirely weak and by control ID, so that nowhere do we hold on
     * to a reference to an ExtJS component (to minimize inadvertent memory leaks)
     * @private
     * @param bindingAdapter
     * @param config
     * @param theControl
     * @param binding
     * @param propBindingAdapter
     */
    applyPropBindingToControl:function (bindingAdapter, config, theControl, binding, propBindingAdapter) {
        // if glu.testMode then store a reference to the control within the view model
        //TODO: Make sure registerCOntrolBinding just hands in Id
        if (glu.testMode) {
            binding.localModel.registerControlBinding(binding.propPath, theControl);
        }

        var modelEventName = binding.propPath + 'Changed';
        glu.log.debug('binding model event name of ' + modelEventName);

        var controlId = theControl.id;
        var controlValueSetter = propBindingAdapter.setComponentProperty;
        if (controlValueSetter === undefined) {//default to the form 'control.setFoo(value)', where foo is the name
            var setterName = 'set' + glu.string(binding.controlPropName).toPascalCase();
            var testSetter = theControl[setterName];
            if (testSetter === undefined) {
                glu.log.debug('Attempted to bind non-existent value setter "' + setterName + '" on xtype: ' + theControl.xtype);
                return;
            }
            controlValueSetter = function (value, oldValue, options, control) {
                control[setterName].call(control, value);
            };
        }
        //sometimes you need to store the control property somewhere else because of ExtJS internals
        var storeInControlAs = propBindingAdapter.storeValueInComponentAs || binding.controlPropName;
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
            controlValueSetter(value, oldValue, options, control);
            //set the underlying field as a tracker
            control[storeInControlAs] = value;
        };

        glu.log.debug('LISTENING on viewmodel property ' + modelEventName);
        binding.localModel.on(modelEventName, wrapper);
    }
});
