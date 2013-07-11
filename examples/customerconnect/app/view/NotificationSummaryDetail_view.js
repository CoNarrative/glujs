glu.defView('ps.notificationSummaryDetail', {
    xtype: 'container',
    layout: {
        type: 'vbox'
    },
    items: [
        {
            xtype: 'fieldset',
            title: 'Select',
            items: [
                {
                    xtype: 'selectfield',
                    label: 'Type',
                    options: '@{notificationTypes}',
                    value:'@{selectedNotificationTypeFilter}'
                }
            ]
        },
        {
            xtype: 'container',
            scrollable: true,
            cls: 'notification_container',
            flex: 1,
            items: '@{notifications}'
        }
    ]
});