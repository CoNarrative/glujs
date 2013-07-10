glu.defView('ps.notificationSummaryDetail', {
    xtype: 'container',
    layout: {
        type: 'vbox'
    },
    items: [
        {
            html: '<h2>Notifications</h2>'
        },
        {
            html: '@{message}'
        },
        {
            xtype: 'container',
            layout: {
                type: 'vbox'
            },
            items: '@{notifications}'
        }
    ]
});