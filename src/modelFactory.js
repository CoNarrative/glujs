/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.model = function (config) {
    //clean up arguments...
    if (glu.isString(config)) {
        config = {
            mtype : config
        };
    }
    if (config.mtype && config.mtype.indexOf('.')>-1){
        var split = glu._splitReference(config.mtype);
        config.ns = split.ns;
        config.mtype = split.name;
    }

    function upcastIfNeeded (cfg){
        if (cfg.mtype==='viewmodel' &&  (cfg.fields || cfg.recType || cfg.modelType || cfg.model)) {
            return 'datamodel';
        }
        return cfg.mtype;
    }
	
	//determine ns...
    var ns = '';
    if (!config.hasOwnProperty('ns')) {
        throw ('Unable to create model: attempting to create a specified view model without a namespace (ns).');
    }
    ns = config.ns;
	var nsObj = glu.namespace(ns);
    var nsObjVM = glu.namespace(ns + '.' + glu.conventions.viewmodelNs);

    config.mtype = config.mtype || 'viewmodel';
    config.mtype = upcastIfNeeded(config);
    var mtype = config.mtype;

    if (glu.mtypeRegistry.hasOwnProperty(mtype)) {
        //not a view model
		var mixins = config.mixins || [], applyMixins=[], i=0;
		for (; i < mixins.length; i++) {
			var mixinConfig = mixins[i], mixinName;
			if( glu.isObject(mixinConfig) )
				mixinName = mixinConfig.type;
			else
				mixinName = mixinConfig;
			var mixin = nsObjVM[mixinName] || nsObj[mixinName] || glu.mtypeRegistry[mixinName];
			if (mixin === undefined) {
				var factory = nsObjVM[mixinName + 'Factory'];
				if (factory === undefined)     throw ('Unable to find mixin: ' + mixinName );
				mixin = factory(config);
			}
			if( glu.isObject(mixinConfig) )
				glu.apply(mixin, mixinConfig);
			glu.deepApply(config, mixin, true);
			applyMixins.push(mixin);
			if( glu.mtypeRegistry[mixinName] )
				delete config.mixins;
		}
		var temp = new glu.mtypeRegistry[mtype](config);
		for( i=0; i < applyMixins.length; i++ ){
			if( applyMixins[i].initMixin )
				applyMixins[i].initMixin.apply(temp);
		}
		return temp;
    }
    //try seeing if it is a view model in the namespace
    glu.log.debug(mtype + ' is not a built-in type, checking for a view model under the namespace. ');
    
    var className = mtype;
    var vmSpecBase = nsObjVM[className] || nsObj[className];
    if (vmSpecBase === undefined) {
        //check for factory
        var factory = nsObjVM[className + 'Factory'];
        if (factory === undefined) {
            throw ('Unable to create model: Could not find specification for view model ' + className);
        }
        vmSpecBase = factory(config);
    }
    //make a copy...
    var vmSpec = {};
    //apply mixins...
    //applyMixins(vmSpecBase);
	
    //apply the specification
    glu.deepApply(vmSpec, vmSpecBase);
    //apply unique configs over top...
    glu.deepApply(vmSpec, config);
    vmSpec.mtype = vmSpecBase.mtype || 'viewmodel';
    vmSpec.mtype = upcastIfNeeded(vmSpec);
    vmSpec.ns = ns;
    vmSpec.viewmodelName = className;
    vmSpec.referenceName = vmSpec.referenceName || 'root';
    return new glu.model(vmSpec);
};