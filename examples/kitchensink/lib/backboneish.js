glu.mreg('backboneish',{
    initMixin:function(){
        this.__id = _.uniqueId('gluvm-');
        this.on('propertychanged',this.propChange, this);
        if (this.mtype === 'list') {
            //do list stuff here...
            this.get = this.getById;
//            this.on('added',function(){this.fireEvent(),this})
        }
        var originalOn = _.bind(this.on, this);
        var me = this;
        this.on = function(evtName, listener, scope) {
            if (scope && scope.cid) {
                //make it a graph observable so we can pull the plug all at once later
                if (!scope._ob) {
                    scope._ob = new glu.GraphObservable({node:scope});
                }
                if (!scope[me.__id]){
                    scope._ob.attach(me.__id, me);
                }
                scope._ob.on(me.__id + '.' + evtName, listener, scope);
            } else {
                originalOn(arguments)
            };
        }
    },
    propChange:function(name, value){
        this.fireEvent('change:' + name.toLowerCase(), this, value);
    },
    /**
     * This is Backbone telling us to stop sending events to the view. We'll disconnect by the view name
     * @param name
     * @param callback
     * @param view
     */
    off:function(name,callback, view){
        view._ob.detach(this.id);
    }
});