glu.defModel('ps.notificationSummary', {
    id: '',
    message: '',
    count: '',
    type: '',
    openScreen: function () {
        //Set the selected NotificationSummary on the Home view model
        this.parentVM.set('selectedNotificationSummary', this);
        //Call OpenScreen on the Main view model
        this.rootVM.openScreen('notificationSummaryDetail','home');
    }
})
