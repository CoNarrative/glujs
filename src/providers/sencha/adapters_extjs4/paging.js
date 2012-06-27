/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.paging
 * @author Mike Gai, Nick Tackes
 * @extends glu.extjs.adapters.container
 *
 * The paging control has three basic functions within ExtJS
 *  - trigger a refresh
 *  - display total records and position therein
 *  - change the page number / start index
 * Within glu, all of these
 * The paging control is "intercepted" by the glu binder so that its typical behavior of changing the page number and
 * forcing an update of the store is managed by the view model instead of assumed.
 *
 *
 */

glu.regAdapter('pagingtoolbar', {
    extend : 'container',

    beforeCreate:function (config, viewmodel) {
        if (config.paging && config.paging.limit) {
            config.pageSize = config.pageSize || config.paging.limit;
        }
    },

    /**
     * @cfg {Function} refreshHandler
     *
     */
    //afterCreate is essentially a ExtJS plugin without the overhead
    afterCreate:function (control, viewmodel) {
        control.startIndex = control.startIndex || 0;
        //veto the pager changing anything...
        if (Ext.getVersion().major > 3) {
            control.addListener('beforechange', function (pager, page) {
                this.fireEvent('pagechanged', pager, page);
                return false;
            }, control);
        } else {
            control.addListener('beforechange', function (pager, params) {
                //this is called from doLoad();
                this.startIndex = params[this.getParams().start];
                this.fireEvent('startindexchanged', pager, this.startIndex);
                return false;
            }, control);
        }

        if (!control.refresh) {
            //Ext 4.x compatibility
            control.refresh = control.items.getByKey('refresh');
        }
        if (control.noRefresh || control.hideRefresh) {
            control.refresh.hide();
        }
        control.refresh.handler = function () {
            if (this.refreshHandler) {
                this.refreshHandler();
            } else {
                if (Ext.getVersion().major>3){
                    var page = this.store.currentPage;
                    this.store.loadPage(page);
                }
            }
        };
        control.setPageSize = function (value) {
            this.pageSize = value;
        };
        if (!(Ext.getVersion().major > 3)) {
            //Ext 4.0 track current page in the *store* not the pager control, so not necessary
            control.store.un('load', control.onLoad, control);
            control.actualOnLoad = control.onLoad;
            control.onLoad = function (store, r, o) {
                var keys = this.getParams();
                o.params = {};
                o.params[keys.start] = this.startIndex;
                //o.params[keys.start] = o.params[keys.start] || this.startIndex;
                // if (this.startIndex != o.params[keys.start]){
                // //TODO:pages have loaded out of order - actually now let the store have a little control and set the page to what it should be...
                // }
                this.actualOnLoad(store, r, o);
            };
            control.store.on('load', control.onLoad, control);
            control.onLoad(control.store, [], {});
        }

    },
    /**
     * @cfg {Ext.data.Store} store
     * The store for this pager.
     *
     * *One-time binding*
     *
     * **Convention**: @{*itemList*}
     */

    storeBindings:{
        suppressViewmodelUpdate:true
    },
    startIndexBindings:{
        eventName:'startindexchanged',
        eventConverter:function (pager, e) {
            return e;
        },
        setComponentProperty:function (value, oldValue, options, control) {
            //do nothing actually -- but will signal to glu that it is OK to set
        }
    },

    /**
     * @cfg {Integer} page
     *
     * The current page that this is set to.
     *
     * It is an unusual binding in that it doesn't update visually until after it receives a "load" event
     * from the store.
     *
     * *Two-way Binding*
     *
     * **Convention**: @{*itemList*Page}
     */
    pageBindings:{
        eventName:'pagechanged',
        eventConverter:function (pager, e) {
            return e;
        },
        setComponentProperty:function (value, oldValue, options, control) {
            //do nothing actually -- but will signal to glu that it is OK to set
        }
    },
    defaultTypes:{
        items:'button'
    }
});
