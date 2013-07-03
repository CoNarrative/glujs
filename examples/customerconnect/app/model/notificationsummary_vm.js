glu.defModel('ps.notificationSummary', {
    id: '',
    message: '',
    count: '',
    type: '',
    updateActiveScreen: function () {

        this.parentVM.parentVM.set('selectedNotificationSummary', this);
        this.parentVM.parentVM.updateActiveScreen();
    }
})
glu.defModel('ps.notificationSummaryDetail', {
    fields: ['id', 'message', 'count', 'type'],
    id: '',
    message: '',
    count: '',
    type: '',
    when_selectedNotificationSummary_changes: {
        on: ['parentVM.selectedNotificationSummaryChanged'],
        action: function () {
            this.loadData(this.parentVM.selectedNotificationSummary);
            if(this.type ==='email') this.notifications.loadData(this.parentVM.emailNotificationList.toArray());
            if(this.type ==='response') this.notifications.loadData(this.parentVM.responseNotificationList.toArray());
        }
    },
    notifications:{
        mtype:'list',
        mixins: ['keytracking','listupdater']
    }
})



