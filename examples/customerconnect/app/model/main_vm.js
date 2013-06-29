glu.defModel('ps.main', {
    name: 'Customer Connect',
    init: function () {
        var home = this.model({mtype: 'home'});
//        home.init();
        this.screens.add(home);
        this.set('activeScreen', home);
        var notification = this.model({mtype: 'notification'});
//        notification.init();
        this.screens.add(notification);
        this.set('activeScreen', notification);
    },

    screens: {
        mtype: 'activatorlist',
        autoParent: true,
        focusProperty: 'activeScreen'
    },
    activeScreen: {mtype: 'home'}
});

glu.defModel('ps.home',{
    init:function(){
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
glu.defModel('ps.notification',{

});