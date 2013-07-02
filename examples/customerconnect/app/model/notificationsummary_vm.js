glu.defModel('ps.notificationSummary', {
//    fields:['id','count','type'],
    id: '',
    message: '',
    count: '',
    type: '',
    updateActiveScreen: function () {

        this.parentVM.parentVM.set('selectedNotificationSummary',this);
        this.parentVM.parentVM.updateActiveScreen();
    }
})
glu.defModel('ps.notificationSummaryDetail', {
//    config:{
//        fields:['id','message','count','type']
//    },
    fields:['id','message','count','type'],
    id: '',
    message: '',
    count: '',
    type: '',
    when_selectedNotificationSummary_changes:{
        on:['parentVM.selectedNotificationSummaryChanged'],
        action:function(){
            debugger;
          //  this.loadData(this.parentVM.selectedNotificationSummary);
        }
    }
//    summary$: function () {
//        debugger;
//        return this.parentVM.selectedNotificationSummary;
//    }
})



