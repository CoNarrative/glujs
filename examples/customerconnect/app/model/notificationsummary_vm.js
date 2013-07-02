glu.defModel('ps.notificationSummary', {
//    fields:['id','count','type'],
    id: '',
    message: '',
    count: '',
    type: '',
    updateActiveScreen: function () {
        this.parentVM.parentVM.updateActiveScreen();
    }
})

glu.defModel('ps.notification', {

})