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
    navigateBackIsEnabled$:function(){
      return this.screenStack.length >0;
    },
    navigateBackIsHidden$:function(){
        debugger;
        return this.screenStack.length <= 0;
    },
    navigateBack:function(){
        var screen = this.screenStack.getAt(this.screenStack.length-1);
        this.screenStack.removeAt(this.screenStack.length-1);
        this.switchScreen(screen);
    },
    screenStack: {
      mtype:'list'
    },
    switchScreen:function(screenName){
        var screen = this.screens.where(function (s) {
            return s.viewmodelName === screenName
        });
        var newActiveScreen = screen[0];
        this.screens.setActiveItem(newActiveScreen);
    },
    openScreen:function(screenName){
        var screen = this.screens.where(function (s) {
            return s.viewmodelName === screenName
        });

        //TODO:  If screen is not found, then created it.
        var newActiveScreen = screen[0];
        this.screenStack.add(this.activeScreen.viewmodelName);
        this.screens.setActiveItem(newActiveScreen);
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

