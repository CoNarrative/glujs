glu.defView('ps.home', {
    xtype: 'container',
    cls: 'notification_container',
    layout: {
        type: 'vbox'
    },
    height: 500,
    weight: 500,
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
            items: '@{notificationSummaryList}'
        }
    ]
});
