glu.defModel('ps.notificationSummaryDetail', {
    fields: ['id', 'message', 'count', 'type'],
    init: function () {
        this.loadData(this.parentScreenVM.selectedNotificationSummary);
        this.loadNotifications();
    },
    id: '',
    message: '',
    count: '',
    type: '',
    notificationTypes: [
        {text: 'E-mail', value: 'email'},
        {text: 'Message', value: 'message'},
        {text: 'Response', value: 'response'}
    ],
    selectedNotificationTypeFilter: 'message',
    when_type_changes_set_selectedNotificationTypeFilter: {
        on: 'typeChanged',
        action: function () {
            this.set('selectedNotificationTypeFilter',this.type);
        }
    },
    when_selectedNotificationTypeFilter_changes: {
        on: 'selectedNotificationTypeFilterChanged',
        action: function () {
            this.set('type', this.selectedNotificationTypeFilter);
            this.loadNotifications();
        }
    },
    when_selectedNotificationSummary_changes: {
        on: ['parentScreenVM.selectedNotificationSummaryChanged'],
        action: function () {
            this.loadData(this.parentScreenVM.selectedNotificationSummary);
            this.loadNotifications();
        }
    },
    notifications: {
        mtype: 'list',
        mixins: ['keytracking', 'listupdater']
    },
    loadNotifications: function () {
        //TODO:  Replace with calls to server, local storage, or etc.
        if (this.type === 'email') this.notifications.loadData(this.rootVM.emailNotificationList.toArray());
        if (this.type === 'response') this.notifications.loadData(this.rootVM.responseNotificationList.toArray());
        if (this.type === 'message') this.notifications.loadData(this.rootVM.messageNotificationList.toArray());
    }
})