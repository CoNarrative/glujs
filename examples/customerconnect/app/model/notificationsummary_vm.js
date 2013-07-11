glu.defModel('ps.notificationSummary', {
    id: '',
    message: '',
    count: '',
    type: '',
    iconClass$:function(){
        if (this.type ==='email') return 'icon-envelope-alt'
        if (this.type ==='message') return 'icon-keyboard'
        if (this.type ==='response') return 'icon-reply'
    },
    openScreen: function () {
        //Set the selected NotificationSummary on the Home view model
        this.parentVM.set('selectedNotificationSummary', this);
        //Call OpenScreen on the Main view model
        this.rootVM.openScreen('notificationSummaryDetail','home');
    }
})
