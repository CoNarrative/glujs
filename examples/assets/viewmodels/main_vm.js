glu.defModel('examples.assets.main', {
    options:{
        mtype:'options'
    },

    sliceCounter:1,

    assetSetList:{
        mtype:'activatorlist',
        focusProperty:'assetSetWithFocus'
    },

    assetSetWithFocus: {mtype:'assetSet', name:'dummy'},

    title$: function(){
        return this.localize('title',{focusName: this.assetSetWithFocus.name});
    },

    detail:{ mtype:'asset' },

    init:function(){
        this.cloneSet(); //clone dummy asset set
    },

    //COMMANDS
    cloneSet:function () {
        var newSlice = this.model(this.assetSetWithFocus.clone());
        newSlice.set('name', 'Asset Set ' + this.sliceCounter++);
        this.assetSetList.add(newSlice);
        newSlice.init();
        this.set('assetSetWithFocus', newSlice);
    },

    openOptions:function () {
        this.open(this.options);
    },

    //REACTIONS
    when_selected_asset_changes_then_load_detail:{
        on:['assetSetWithFocusChanged','assetSetWithFocus.assetWithFocusChanged'],
        action:function () {
            if (this.assetSetWithFocus.assetWithFocus == null) return;
            this.detail.load(this.assetSetWithFocus.assetWithFocus.get('id'));
        }
    },

    //EXTERNAL
    notifyAssetChanged:function () {
        this.assetSetList.getActiveItem().refreshAssetList();
    }
});