glu.defModel('ps.main', {
    name: 'Customer Connect',
    init: function () {
        var home = this.model({mtype: 'home'});
        this.screens.add(home);

        var notificationSummaryDetail = this.model({mtype: 'notificationSummaryDetail'});
        this.screens.add(notificationSummaryDetail);

//        var notification = this.model({mtype: 'notification'});
//        this.screens.add(notification);

        this.setRaw('activeScreen', home);
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
    notification:{
        mtype:'list'
    },
    selectedNotificationSummary:{
        mtype:'notificationSummary'
    }
});

