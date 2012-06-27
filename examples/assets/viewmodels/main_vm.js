glu.defModel('examples.assets.main', {
    options : {
        mtype : 'options'
    },

    sliceCounter : 2,

    assetSetList : {
        mtype:'activatorlist',
        items : [{mtype:'assetSet', name:'Asset Set 1'}]
    },
    detail:{
        mtype:'asset'
    },

    //COMMANDS
    cloneSet : function(){
        var newSlice = this.model(this.assetSetList.activeItem.clone());
        newSlice.set('name', 'Asset Set ' + this.sliceCounter++);
        this.assetSetList.add(newSlice);
        newSlice.init();
        this.assetSetList.setActiveItem(newSlice);
    },

    openOptions : function(){
        this.open(this.options);
    },

    //EXTERNAL
    notifyAssetChanged:function(){
        this.assetSetList.getActiveItem().refreshAssetList();
    }
});