glu.defView('ps.notificationSummary', {
    xtype: 'container',
    cls: 'notification_summary',
    layout: {
        type: 'hbox'
    },
    listeners: [
        {
            event: 'tap',
            element: 'element',
            fn: '@{openScreen}'
        }
    ],
    items: [
        {
            xtype: 'label',
            html: '@{count}'

        },
        {
            xtype: 'label',
            html: '@{message}'
        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                pack:'end',
                align:'start'
            },
            flex:.2,
            items: [
                {
                    xtype: 'label',
                    cls: 'notification_icon',
                    html: '<i class=@{iconClass}></i>',
                    margin:'0 10 0 0'
                }
            ]
        }
    ]
});

