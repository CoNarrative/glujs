glu.defModel('ps.main', {
    name: 'Customer Connect',
    init: function () {
        var home = this.model({mtype: 'home'});
        this.screens.add(home);

        var notification = this.model({mtype: 'notification'});
        this.screens.add(notification);

        this.setRaw('activeScreen', home);

    },

    screens: {
        mtype: 'activatorlist',
        autoParent: true,
        focusProperty: 'activeScreen'
    },
    activeScreen: {mtype: 'home'},
    updateActiveScreen: function () {

        this.screens.setActiveItem(this.screens.getAt(1));
    }
});

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
    },
//    updateActiveScreen: function () {
//        this.screens.setActiveItem(this.screes.getAt(1));
//    }
});

glu.defModel('ps.notification', {

});