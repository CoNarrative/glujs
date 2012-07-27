/*
 * Copyright (c) 2012 CoNarrative
 */
Ext.ns('glu.provider.binder');
Ext.apply(glu.provider.binder, {
    getAdapter:function (config) {
        // if its a plugin, return a dummy adapter that does nothing
        if (config.ptype) {
            return glu.provider.adapters.ptype;
        }
        var xtype = config.xtype;
        var adapter = null;
        do {
            adapter = glu.provider.adapters[xtype];
            if (!adapter) {
                if (Ext.getVersion().major > 3 || Ext.getProvider().provider == 'touch') {
                    var currentType = Ext.ClassManager.getByAlias('widget.' + xtype);
                    if (!currentType) {
                        throw (xtype + ' is not a valid xtype');
                    }
                    xtype = currentType.superclass.xtype;
                } else {
                    var currentType = Ext.ComponentMgr.types[xtype];
                    if (!currentType) {
                        throw (xtype + ' is not a valid xtype');
                    }
                    xtype = currentType.superclass.constructor.xtype;
                }

            }
        } while (!adapter);
        //use the xtype chain

        if (xtype != config.xtype) {
            glu.log.info('No exact binding adaptor for ' + config.xtype + '; using adapter for ' + xtype + ' instead.');
        }

        //initialize the adapter if it hasn't been. We can do this simply because these are singletons
        return this.initAdapter(adapter);
    },

    /**
     * Lazy chains adapter to make debugging simpler and avoid file ordering issues
     */
    initAdapter : function (adapterDef){
        if (adapterDef.initialized) {
            return adapterDef;
        }
        var ns = glu.provider.adapters;
        var name = adapterDef.name;
        if (adapterDef.extend) {
            var child = ns[adapterDef.extend];
            this.initAdapter(child);
        }
        if (adapterDef.extend && adapterDef.extend.indexOf('.')==-1){
            adapterDef.extend = 'glu.provider.adapters.' + glu.symbol(adapterDef.extend).toPascalCase();
        }
        var className = 'glu.provider.adapters.' + glu.symbol(name).toPascalCase();
        if (Ext.getVersion().major>3 || Ext.getProvider().provider == 'touch') {
            //adapterDef.singleton = true;   //NOT doing a singleton, but making a separate class name so that it matches Ext 3 pattern
            var adapterClass = Ext.define (className, adapterDef);
        } else {
            var base = (adapterDef.extend ? glu.walk(adapterDef.extend) : null) || Object;
            var adapterClass = Ext.extend(base,adapterDef);
            ns[glu.symbol(name).toPascalCase()] = adapterClass;
        }
        var adapter = new adapterClass();
        ns[name] = adapter;
        adapter.name = name;
        if (adapter.initAdapter) {
            adapter.initAdapter();
        }
        adapter.initialized = true;
        return adapter;
    },

    isRegistered:function (xtype) {
        return Ext.ComponentMgr.isRegistered(xtype) || ((Ext.getVersion().major > 3 || Ext.getProvider().provider == 'touch') && Ext.ClassManager.getNameByAlias('widget.' + xtype) !== '');
    }
});