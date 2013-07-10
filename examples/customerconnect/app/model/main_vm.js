glu.defModel('ps.main', {
    name: 'Customer Connect',
    mixins:['notificationData'],
    init: function () {
        /**At this point you could change the "mode" of ViewModel and load a specific vieq. i.e. small vs large form factor **/
        var home = this.model({mtype: 'home'});
        this.screens.add(home);

//        var notificationSummaryDetail = this.model({mtype: 'notificationSummaryDetail'});
//        this.screens.add(notificationSummaryDetail);

        this.setRaw('activeScreen', home);
        //Load Notifications
        this.loadNotificationList();
    },
    /** PROPERTIES **/
    screens: {
        mtype: 'activatorlist',
        autoParent: true,
        focusProperty: 'activeScreen'
    },
    activeScreen: {mtype: 'home'},
    screenStack: {
        mtype: 'list'
    },
    /** FORMULAS **/
    /** NAVIGATION **/
    navigateBackIsHidden$: function () {
        return this.screenStack.length <= 0;
    },
    /** COMMANDS **/
    navigateBack: function () {
        var screen = this.screenStack.getAt(this.screenStack.length - 1);
        this.screenStack.removeAt(this.screenStack.length - 1);
        this.switchScreen(screen);
    },

    switchScreen: function (screenName) {
        var screen = this.screens.where(function (s) {
            return s.viewmodelName === screenName
        });
        var newActiveScreen = screen[0];
        this.screens.setActiveItem(newActiveScreen);
    },
    openScreen: function (screenName, parentScreenName) {
        var parentScreenResults = this.screens.where(function (s) {
            return s.viewmodelName === parentScreenName
        });
        var parentScreenVM = parentScreenResults.length > 0 ? parentScreenResults[0] : null;

        //Get or create new "Screen"
        var screen = this.screens.where(function (s) {
            return s.viewmodelName === screenName
        });
        if (screen.length > 0) {
            newActiveScreen = screen[0]
        } else {
            newActiveScreen = this.model({mtype: screenName,parentScreenVM:parentScreenVM});
            this.screens.add(newActiveScreen);
        }

        this.screenStack.add(this.activeScreen.viewmodelName);
        this.screens.setActiveItem(newActiveScreen);
    }

});

