glu.defView('ps.notificationSummaryDetail', {
    xtype: 'container',
    layout: {
        type: 'vbox'
    },
    items: [
        {
            html: '@{message}'
        },
        {
            xtype: 'container',
            scrollable:true,
            cls:'notification_container',
            flex:1,
            items: '@{notifications}'
        }
    ]
});