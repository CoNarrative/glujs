glu.defModel('ps.notificationSummaryData', {
    /** Notifications Summary**/
    notificationSummaryList: {
        mtype: 'list',
        mixins: ['keytracking', 'sorted', 'listupdater'],
        sortRanker: function (notification) {
            return notification.priority;
        }
    },
    loadNotificationSummaryList: function () {
        this.ajax({
            url: 'notificationsummary',
            method: 'GET',
            success: function (response, opts) {
                var responseObj = Ext.decode(response.responseText);
                if (responseObj.success) {
                    for (var i = 0; i < responseObj.rows.length; i++) {
                        var newModel = this.model('notificationSummary', responseObj.rows[i]);
                        //TODO:  Check to make sure the silent paramter is being used.
                        this.notificationSummaryList.add(newModel, true);
                        debugger;
                    }
                } else {

                }
            },
            failure: function (response, opts) {
                var responseText = (response.responseText ? response.responseText : 'Unable to contact the server.  Please try again later.');
                Ext.Msg.alert('Status', 'Unable to contact the server.  Please try again later.');
            }
        })
    }
});