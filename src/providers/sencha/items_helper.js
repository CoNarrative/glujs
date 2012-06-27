/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.provider.itemsHelper = {

    /*
     * Handles additions to the observable list
     */
    respondToAdd:function (item, idx, context, needsDoLayout) {
        glu.log.indentMore();
        glu.log.debug(glu.log.indent + 'processing item added to collection');
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
            item.parentVM = list;
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
            viewItem = glu.view(item, item.ns, item.viewmodelName, {}, {}, container.initialConfig);
        }
        // if(viewItem.closable) {
        // interceptCloseCommand(viewItem);
        // }
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
        //listen to changed event on add/remove
        list.on('added', function (item, idx) {
            this.respondToAdd(item, idx, context, needsDoLayout)
        }, this);
        list.on('removed', function (item, idx) {
            //container._changeOriginatedFromModel=true;
            container.remove(idx);
        }, this);
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
                    //container._changeOriginatedFromModel=true;
                    container.remove(idx);
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
