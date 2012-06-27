/*
 * Copyright (C) 2012 by CoNarrative
 */

Ext.namespace('glu.provider');
Ext.apply(glu.provider, {
    getCmp:function (id) {
        return Ext.getCmp(id);
    },
    widget:(Ext.getVersion().major > 3 || Ext.getProvider().provider == 'touch') ? function (config) {
        return Ext.widget(config.xtype, config);
    } : function (config) {
        return Ext.create(config)
    },

    view:function (vm, viewSpec, parent) {
        viewSpec.xtype = viewSpec.xtype || 'panel';
        var bindings = glu.provider.binder.collectBindings(viewSpec, vm, parent).bindings;
        var view = this.widget(viewSpec);
        glu.provider.binder.applyBindingsList(bindings);
        return view;
    },
    namespace:function (str) {
        return Ext.namespace(str);
    },
    apply:function (obj, config, defaults) {
        return Ext.apply(obj, config, defaults);
    },
    viewport:function (config) {
        var view = glu.createViewmodelAndView(config);
        if (Ext.getProvider().provider == 'touch') {
            var viewport = Ext.Viewport.add(view);
        }
        else {
            return new Ext.Viewport({
                layout:'fit',
                items:[view]
            });
        }
    },
    confirm:function (title, message, fn, scope) {
        if (Ext.isObject(title)) {
            return Ext.Msg.show(title);
        }
        else {
            return Ext.Msg.confirm(title, message, fn, scope);
        }
    },
    message:function (title, message, fn, scope) {
        return Ext.Msg.alert(title, message, fn, scope);
    },

    /* returns a viewmodel entry point as a constructor
     * and registers it with ExtJS
     * The entry point is the actual view created as a panel
     * and is entirely overrideable at "put in container" time
     */

    panel:function (xtypeName, vmConfig) {
        if (glu.isObject(xtypeName)) {
            vmConfig = xtypeName;
            xtypeName = vmConfig.xtype;
        }
        var ctor = function (extjsConfig) {
            //1: Initialize the viewmodel
            if (extjsConfig.viewmodelConfig) {
                glu.deepApply(vmConfig, extjsConfig.viewmodelConfig);
            }
            var vm = glu.model(vmConfig);
            vm.init();
            //2: Get the bound config specification for the matching view...
            delete extjsConfig.xtype;
            var viewSpec = glu.getViewSpec(vm, vm.ns, vm.viewmodel, extjsConfig, {
                xtype:'panel'
            });
            //3: Perform the bindings...
            var bindings = glu.provider.binder.collectBindings(viewSpec, vm).bindings;

            if (Ext.isString(viewSpec))
                throw viewSpec;
            //4: Finish creating the control through calling the constructor on the transformed viewSpec
            type.superclass.constructor.call(this, viewSpec);
            //4A: Add rootVM reference
            this.vm = vm;
            //5: Add activate binding (in case it is a tab. This would be handled by a higher level view model if this wasn't the root')...
            this.on('activate', vm.activate, vm);
            //6: Apply bindings list to the created control
            glu.provider.binder.applyBindingsList(bindings);
        };
        if (Ext.getVersion().major > 3 || Ext.getProvider().provider == 'touch') {
            var cfg = {
                extend:'Ext.panel.Panel',
                constructor:ctor
            };
            if (xtypeName != null) {
                cfg.alias = 'widget.' + xtypeName;
            }
            var type = Ext.define('glu.panels.' + Ext.id().replace('-', '_'), cfg);
            return type;
        } else {
            var type = Ext.extend(Ext.Panel, {
                constructor:ctor
            });
            if (xtypeName != null) {
                Ext.reg(xtypeName, type);
            }
            return type;
        }

    },


    /*
     * 'windowizes' a panel and pops it up
     */
    openWindow:function (config) {
        var view = glu.createViewmodelAndView(config, true);
        if (glu.testMode!==true){
            view.show();
        }
        return view;
    },

    /**
     * Registers an adapter. Inheritance via the extend property is wired up lazily so that ordering
     * is irrelevant
     */
    regAdapter:function (name, adapterDef) {
        var ns = Ext.ns('glu.provider.adapters');
        adapter = adapterDef;
        ns[name] = adapter;
        adapter.name = name;
        return adapter;
    }
});