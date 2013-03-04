/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.provider.itemsHelper = {

    /*
     * Handles additions to the observable list
     */
    respondToAdd:function (item, idx, context, needsDoLayout) {
        glu.log.indentMore();
        glu.log.debug(glu.log.indent + 'Processing a view item added to collection at index ' + idx);
        var list = context.viewmodel.get(context.binding.modelPropName);
        var container = context.control;
        if (!container.itemTemplate && !(item.mtype == 'viewmodel' || item.mtype == 'datamodel')) {
            throw "Cannot render an item within a bound items list because there is neither an itemTemplate defined nor is the item a viewmodel";
        }
        var viewItem = null;

        if (container.itemTemplate) {//use item template if it exists
            var viewItemSpec = glu.isFunction(container.itemTemplate) ? container.itemTemplate(item, idx) : glu.deepApply({}, container.itemTemplate);
            if (viewItemSpec === undefined)
                return;
            //do nothing if template is null...
            item.parentVM = list.parentVM;
            item.rootVM = list.rootVM;
            item.ns = list.ns;
            item.recType = list.recType;
            var result = glu.provider.binder.collectBindings(viewItemSpec, item, container.initialConfig);
            var boundConfigs = result.bindings;
            //Make a record observable as needed...
            if (item.phantom != null && boundConfigs.length > 0) {
                //TODO: Make sure that it isn't one way bindings...'
                this.makeRecordObservable(item);
            }
            viewItem = glu.widget(viewItemSpec);
            glu.provider.binder.applyBindingsList(boundConfigs);

        } else {//view model
            var viewModelName = item.viewmodelName;
            if( container.initialConfig.defaults && container.initialConfig.defaults.viewMode ){
                viewModelName += '_'+container.initialConfig.defaults.viewMode;
            }
            viewItem = glu.view(item, item.ns, viewModelName, {}, {}, container.initialConfig);
        }
        // if(viewItem.closable) {
        // interceptCloseCommand(viewItem);
        // }
        viewItem._vm = item; //add view model directly to view (for now)
        if (container.insert) {
            container.insert(idx, viewItem);
        } else {
            container.items.insert(idx, viewItem);
        }
        //apply as needed...
        if (needsDoLayout) {
            container.doLayout();
        }
        //No more doLayout in Touch
        if(Ext.getProvider().provider=='touch')
        {
            container.setActiveItem(0);
        }
        //make sure the view item has a reference back to the model in case it needs it...
        viewItem.model = item;
        glu.log.indentLess();
    },
    /* DOCS DISABLED FOR NOW
     * Initializes a bound item list
     * Does not deal with "activation"
     */
    bindItems:function (context, needsDoLayout) {
        glu.log.indentMore();
        glu.log.debug(glu.log.indent + 'processing bound items list');
        context.needsDoLayout = needsDoLayout;
        var list = context.viewmodel.get(context.binding.modelPropName);
        var container = context.control;
        context.valueSetTask = new Ext.util.DelayedTask(function () {
        });
        //MODEL -> CONTAINER
        //step through current items and create matching views
        var me = this;
        //support for enumerations across integer value
        //TODO: should use yield for newer javascripts...
        if (glu.isNumber(list)) {
            var count = list;
            list = [];
            for (var i = 0; i < count + 1; i++) {
                list.push(i);
            }
        }
        list.each = list.each || list.foreach ||
            function (process) {
                for (var i = 0; i < list.length; i++) {
                    process.call(me, list[i], i);
                }
            };


        list.each(function (item, idx) {
            this.respondToAdd(item, idx, context, false, true)
        }, this);
        if (needsDoLayout) {//just one time for all of those initial adds
            container.doLayout();
        }
        //if not observable, then a static list and stop listening...
        if (list.on === undefined)
            return;
        if (list._ob) {
            //its a glu list using the graph observable concept. This will clean up references on remove
            //listen to changed event on add/remove
            glu.temp = glu.temp || {};
            glu.temp.transfers = glu.temp.transfer || {};
            var attachPath = '_vm.' + context.binding.modelPropName +  '.';
            var transferKey = context.viewmodel.viewmodelName + '-' +context.binding.modelPropName;
            container._ob.on(attachPath + 'added', function (item, idx, isTransfer) {
                if (isTransfer) {
                    //re-use the transferred component
                    var transferral = glu.temp.transfers[transferKey];
                    var component = transferral.shift();
                    if (transferral.length==0) delete glu.temp.transfers[transferKey];
                    delete component._isTransferring;
                    container.autoDestroy = container._autoDestroy;
                    delete container._autoDestroy;
                    if (component.destroyed) {
                        //cannot reuse after all
                        this.respondToAdd(item, idx, context, needsDoLayout);
                        return;
                    }

                    if (container.insert) {
                        container.insert(idx, component);
                    } else {
                        container.items.insert(idx, component);
                    }
                    return;
                };
                this.respondToAdd(item, idx, context, needsDoLayout);
            }, this);
            container._ob.on(attachPath + 'removed', function (item, idx, isTransfer) {
                if (isTransfer) {
                    var component = container.items.getAt(idx);
                    component._isTransferring = true;
                    container._autoDestroy = container.autoDestroy;
                    container.autoDestroy = false;
                    //the key makes sure that we only re-use when moving between identical lists
                    glu.temp.transfers[transferKey] = glu.temp.transfers[transferKey] || [];
                    glu.temp.transfers[transferKey].push(component);
                }
                //suppress tab selection change events
                container._changeOriginatedFromModel=true;

                //ExtJS will find the item if a number is passed, and Touch will not.  We should call removeAt if method exists.
                if(container.removeAt)
                {
                    container.removeAt(idx);
                }
                else{
                    container.remove(idx);
                }

                delete container._changeOriginatedFromModel;
            }, this);

        } else
        //if store, listen that way...
        if (list.data && list.data.on) {
            if (Ext.getVersion().major > 3 || Ext.getProvider().provider == 'touch') {
                //strange that 'add' does not work properly on store in Ext 4∆
                list.data.on('add', function (idx, item) {
                    this.respondToAdd(item, idx, context, needsDoLayout)
                }, this);
                list.data.on('remove', function (idx, item) {
                    //container._changeOriginatedFromModel=true;
                    container.remove(idx);
                }, this);
            } else {
                list.on('add', function (store, items, idx) {
                    for (var it = 0; it < items.length; it++) {
                        this.respondToAdd(items[it], idx + it, context, needsDoLayout)
                    }
                }, this);
                list.on('remove', function (store, item, idx) {
                    //suppress tab selection change events
                    container._changeOriginatedFromModel=true;
                    container.remove(idx);
                    delete container._changeOriginatedFromModel;
                }, this);
            }
        }
        glu.log.indentLess();

    },

    makeRecordObservable:function (item) {
        //TODO: Clean up and unify observable pattern as a mixin!!!!
        item.events = {};
        item.innerSet = item.set;
        item.registerControlBinding = function () {
        };
        //for testing
        item.on = function (name, callback, scope) {
            name = name.toLowerCase();
            if (!this.events.hasOwnProperty(name)) {
                this.events[name] = {
                    listeners:[]
                }
            }
            var evt = this.events[name];
            evt.listeners.push({
                fn:callback,
                scope:scope || glu
            });
        };
        item.fireEvent = function () {
            var name = arguments[0].toLowerCase();
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            if (!this.events.hasOwnProperty(name)) {
                this.events[name] = {
                    listeners:[]
                }
            }
            var evt = this.events[name];
            for (var i = 0; i < evt.listeners.length; i++) {
                var listener = evt.listeners[i];
                var myVeto = listener.fn.apply(listener.scope, args);
                if (myVeto === true) {
                    return false;
                }
            }
            return true;
        };
        item.set = function (propName, value) {
            var oldValue = this.get(propName);
            if (oldValue === value) {
                return;
                //do nothing if it's the same thing.
            }
            this.innerSet(propName, value);
            this.fireEvent(propName + 'Changed', value, oldValue, {
                modelPropName:propName
            });
            this.fireEvent('changed', value, oldValue, {
                modelPropName:propName
            });

        }
    }
};
