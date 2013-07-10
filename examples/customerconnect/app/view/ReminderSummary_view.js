glu.defView('ps.reminderSummary', {
    xtype: 'container',
//    cls: 'reminder',
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
        }
    ]
});

