glu.defModel('ps.main', {
    name: 'Customer Connect',
    init: function () {
        var home = this.model({mtype: 'home'});
        this.screens.add(home);

        var notificationSummaryDetail = this.model({mtype: 'notificationSummaryDetail'});
        this.screens.add(notificationSummaryDetail);

        this.setRaw('activeScreen', home);
        this.loadNotificationList();
    },

    screens: {
        mtype: 'activatorlist',
        autoParent: true,
        focusProperty: 'activeScreen'
    },
    activeScreen: {mtype: 'home'},
    updateActiveScreen: function (screen) {
        this.screens.setActiveItem(this.screens.getAt(1));
    },
    selectedNotificationSummary: {
        mtype: 'notificationSummary'
    },
    notificationList: {
        mtype: 'list',
        mixins: ['keytracking', 'sorted', 'listupdater'],
        sortRanker: function (notification) {
            return notification.priority;
        }
    },
    loadNotificationList: function () {
        this.ajax({
            url: 'notifications',
            method: 'GET',
//            jsonData: {type:},
            success: function (response, opts) {
                var responseObj = Ext.decode(response.responseText);
                if (responseObj.success) {
                    for (var i = 0; i < responseObj.rows.length; i++) {
                        var newModel = this.model('notification', responseObj.rows[i]);
                        //TODO:  Check to make sure the silent paramter is being used.
                        this.notificationList.add(newModel, true);

                    }
                    this.updateLists();

                } else {
                    //Ext.Msg.alert('Status', responseObj.message);
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
    }
});

