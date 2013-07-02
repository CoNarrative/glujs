glu.defModel('ps.home', {
    init: function () {
        this.notificationSummaryList.add(this.model({
            mtype: 'notificationSummary',
            id: 1, type: 'email', count: 3, message: 'Unread messages'}));
        this.notificationSummaryList.add(this.model({
            mtype: 'notificationSummary',
            id: 2, type: 'email', count: 2, message: 'Priority e-mails received.'}));
    },
    notificationSummaryList: {
        mtype: 'list'
    }
});
