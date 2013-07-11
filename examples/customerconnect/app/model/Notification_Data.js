glu.defModel('ps.notificationData', {
    /** Notifications **/
    notificationList: {
        mtype: 'list',
        mixins: ['keytracking', 'sorted', 'listupdater'],
        sortRanker: function (notification) {
            return notification.priority;
        }
    },
    notificationCount$:function(){
      return this.notificationList.length;
    },
    loadNotificationList: function () {
        this.ajax({
            url: 'notifications',
            method: 'GET',
            success: function (response, opts) {
                var responseObj = Ext.decode(response.responseText);
                if (responseObj.success) {
                    for (var i = 0; i < responseObj.rows.length; i++) {
                        var newModel = this.model('notification', responseObj.rows[i]);
                        //TODO:  Check to make sure the silent paramter is being used.
                        this.notificationList.add(newModel, true);
                        this.updateLists();
                    }
                } else {

                }
            },
            failure: function (response, opts) {
                var responseText = (response.responseText ? response.responseText : 'Unable to contact the server.  Please try again later.');
                Ext.Msg.alert('Status', 'Unable to contact the server.  Please try again later.');
            }
        })
    },
    emailNotificationList: {
        mtype: 'list',
        mixins: ['keytracking', 'sorted', 'listupdater'],
        sortRanker: function (notification) {
            return notification.priority;
        }
    },
    responseNotificationList: {
        mtype: 'list',
        mixins: ['keytracking', 'sorted', 'listupdater'],
        sortRanker: function (notification) {
            return notification.priority;
        }
    },
    messageNotificationList: {
        mtype: 'list',
        mixins: ['keytracking', 'sorted', 'listupdater'],
        sortRanker: function (notification) {
            return notification.priority;
        }
    },
    when_notificationList_changes: {
        on: 'notificationList.lengthchanged',
        action: function () {
            console.log('Do resort');
        }
    },
    updateLists: function () {
        var emailNotifications = _.chain(this.notificationList.toArray())
            .filter(function (n) {
                return n.type === 'email';
            });
        this.emailNotificationList.loadData(emailNotifications.value());

        var responseNotificationList = _.chain(this.notificationList.toArray())
            .filter(function (n) {
                return n.type === 'response';
            });
        this.responseNotificationList.loadData(responseNotificationList.value());

        var messageNotificationList = _.chain(this.notificationList.toArray())
            .filter(function (n) {
                return n.type === 'message';
            });
        this.messageNotificationList.loadData(messageNotificationList.value());
    }

});