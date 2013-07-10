glu.defView('ps.home', {
    xtype: 'container',
//    cls: 'notification_container',
    layout: {
        type: 'vbox'
    },
    items: [
        {
            html: '<h2>Notifications</h2>'
        },
        {
            xtype: 'container',
            layout: {
                type: 'vbox',
                pack: 'middle',
            },
            items: '@{notificationSummaryList}'  //List of
        },
        {
            html: '<h2>Reminders</h2>'
        },
        {
            xtype: 'container',
            layout: {
                type: 'vbox',
                pack: 'middle',
            },
            items: '@{reminderSummaryList}'  //List of
        }
    ]
});
