glu.defModel('ps.notificationSummaryDetail', {
    fields: ['id', 'message', 'count', 'type'],
    init:function(){
      this.loadNotifications();
    },
    id: '',
    message: '',
    count: '',
    type: '',
    when_selectedNotificationSummary_changes: {
        on: ['parentScreenVM.selectedNotificationSummaryChanged'],
        action: function () {
            this.loadNotifications();
        }
    },
    notifications:{
        mtype:'list',
        mixins: ['keytracking','listupdater']
    },
    loadNotifications:function(){
        //TODO:  Replace with calls to server, local storage, or etc.
        this.loadData(this.parentScreenVM.selectedNotificationSummary);
        if(this.type ==='email') this.notifications.loadData(this.rootVM.emailNotificationList.toArray());
        if(this.type ==='response') this.notifications.loadData(this.rootVM.responseNotificationList.toArray());
        if(this.type ==='message') this.notifications.loadData(this.rootVM.messageNotificationList.toArray());
    }
})