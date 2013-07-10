glu.defModel('ps.home', {
    init: function () {
        //TODO:  Replace this with an AJAX call.
        this.notificationSummaryList.add(this.model({
            mtype: 'notificationSummary',
            id: 1, type: 'response', count: 3, message: 'Unread messages'}));
        this.notificationSummaryList.add(this.model({
            mtype: 'notificationSummary',
            id: 2, type: 'email', count: 2, message: 'Priority e-mails received'}));
        this.reminderSummaryList.add(this.model({
            mtype: 'reminderSummary',
            id: 3, type: 'meeting', count: 2, message: 'Meetings'}));
    },
    notificationSummaryList: {
        mtype: 'list'
    },
    reminderSummaryList: {
        mtype: 'list'
    },
    selectedNotificationSummary: {
        mtype: 'notificationSummary'
    },
    selectedReminderSummary: {
        mtype: 'reminderSummary'
    }
});
