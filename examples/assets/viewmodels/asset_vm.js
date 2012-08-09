glu.defModel('examples.assets.asset', {
    model:'asset',

    isSaving : false,

    isExpanded$ : function(){
        return this.rootVM.assetSetWithFocus.assetSelections.length>0;
    },

    nameIsValid$:function () {
        return this.get('name').length > 0 ? true : this.localize('valid_needOneCharacter');
    },

    yearsOfMaintenanceIsEnabled$:function () {
        return this.status === 'active';
    },

    maintenanceEndDate$:function(){
        if (this.maintenanceStartDate==null) return 0;
        return Ext.Date.add(this.maintenanceStartDate,Ext.Date.YEAR,this.yearsOfMaintenance);
    },

    yearsOfMaintenanceRemaining$:function(){
        if (this.maintenanceStartDate==null) return 0;
        var yearsLeft = moment(this.maintenanceEndDate).diff(Ext.Date.now(), 'years');
        return yearsLeft;
    },

//    isPastMaintenance$: function(){
//        return this.yearsOfMaintenanceRemaining <= 0;
//    },
//
//    warning$:function(){
//        return this.isPastMaintenance ? 'Past maintenance!' : '';
//    },

    save:function(){
        this.set('isSaving', true)
        this.ajax({
            url:'/json/assets/' + this.id +'/action/save',
            method:'post',
            params:Ext.encode(this.asObject()),
            success:function (r) {
                this.commit();
                this.set('isSaving',false);
                this.refresh();
                //how best to notify grid that we've changed? For now just notify direct
                this.parentVM.notifyAssetChanged();
            }
        })
    },

    saveIsEnabled$:function(){
        return this.isDirty && this.isValid && !this.isSaving;
    },

    revertIsEnabled$:function(){
        return this.isDirty && !this.isSaving;
    },

    //PRIVATE
    load:function (id) {
        this.ajax({
            url:'/json/assets/' + id,
            success:function (r) {
                this.loadData(Ext.decode(r.responseText));
            }
        })
    },
    refresh:function(){
        this.load(this.id);
    }
});
