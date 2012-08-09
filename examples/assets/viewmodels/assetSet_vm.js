glu.defModel('examples.assets.assetSet', {
    name : '',
    assetFilter:'',
    assetList:{
        mtype:'glustore',
        model:'examples.assets.models.Asset',
        remoteSort : true,
        pageSize:5,
        sorters:[{property:'name'}],
        proxy:{
            type:'ajax',
            url:'/json/assets',
            reader:{
                type:'glujson',
                root:'rows',
                totalProperty:'total'
            }
        }
    },
    assetListPage:1,

    //will hold a record once selected...
    assetSelections:[],

    isFocused$ : function(){
        return this.parentVM.assetSetWithFocus == this;
    },

    //likewise
    assetWithFocus:null,

    isClosable$ : function(){
        return this.parentVM.assetSetList.length>1;
    },

    showMissing$ : function(){
        return this.rootVM.options.missingWarning;
    },

    init:function () {
        this.refreshAssetList();
    },

    //COMMANDS
    openAsset:function () {
        var assetWindow = this.open({mtype:'asset'});
        assetWindow.load(this.assetWithFocus.get('id'))
    },

    refreshAssetList:function () {
        this.assetList.loadPage(this.assetListPage);
    },

    requestVerification:function () {
        this.message(this.localize('verifyBegin'));
        this.ajax({
            url:'/json/assets/action/requestVerification',
            params:{ids:this.selectedIds()},
            success:function () { //TODO: Automatically emit removeAssetsSuccess event
                this.refreshAssetList();
                this.parentVM.detail.refresh();
            }
        });
    },

    requestVerificationIsEnabled$:function () {
        return this.assetSelections.length > 0;
    },

    removeAssets:function () {
        this.confirm({
            title:this.localize('removeAssetsTitle'),
            msg:this.localize('removeAssetsMessage'),
            buttons:Ext.Msg.YESNOCANCEL,
            icon:Ext.Msg.QUESTION,
            fn:function (btn) {
                if (btn !== 'yes') return;
                this.removeAssetsActual();
            }
        });
    },

    //TODO: Wire up confirmation automatically by pattern?
    removeAssetsActual:function () {
        this.ajax({
            url:'/json/assets/action/remove',
            params:{ids:this.selectedIds()},
            success:function () { //TODO: Automatically emit removeAssetsSuccess event
                this.refreshAssetList();
            }
        });
    },

    removeAssetsIsEnabled$:function () {
        return this.assetSelections.length > 0;
    },

    when_page_changes_then_reload_grid:{
        on:'assetListPageChanged',
        action:function () {
            this.refreshAssetList();
        }
    },

    //PRIVATE
    selectedIds:function () {
        var ids = [];
        for (var i = 0; i < this.assetSelections.length; i++) {
            ids.push(this.assetSelections[i].get('id'));
        }
        return ids;
    },

    clone :function(){
        return {
            mtype : 'assetSet',
            assetListPage : this.assetListPage
        };
    }
});