glu.defView('ps.home', {
    xtype: 'container',
    cls: 'home_container',
    layout: {
        type: 'vbox'
    },
    items: [
        {
            xtype: 'container',
            layout: {
                type: 'hbox'
            },
            cls: 'notification_header',
            items: [
                {html: '<h2>Notifications</h2>'},
                {xtype: 'label', cls: 'notification_badge', html: '<span class="badge">@{rootVM.notificationCount}</span>'}
            ]
        },
        {
            xtype: 'container',
            cls: 'notification_container',
            scrollable:true,
            flex:1,
//            layout: {
//                type: 'vbox',
//                pack: 'middle',
//            },
            items: '@{notificationSummaryList}'  //List of
        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox'
            },
            cls: 'reminder_header',
            items: [
                {html: '<h2>Reminders</h2>'}
//                {xtype: 'label', cls: 'notification_badge', html: '<span class="badge">@{rootVM.reminderCount}</span>'}
            ]
        },
        {
            xtype: 'container',
            cls: 'reminder_container',
            scrollable:true,
            flex:1,
//            layout: {
//                type: '',
//                pack: 'middle',
//            },
            items: '@{reminderSummaryList}'  //List of
        }
    ]
});
