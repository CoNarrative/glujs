glu.defModel('ps.reminderSummary', {
    id: '',
    message: '',
    count: '',
    type: '',
    openScreen: function () {
        //Set the selected NotificationSummary on the Home view model
        this.parentVM.set('selectedReminderSummary', this);
        //Call OpenScreen on the Main view model
        this.rootVM.openScreen('reminderSummaryDetail');
    }
});
