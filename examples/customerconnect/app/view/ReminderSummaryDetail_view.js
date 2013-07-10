glu.defView('ps.reminderSummaryDetail', {
    xtype: 'container',
    layout: {
        type: 'vbox'
    },
    items: [
        {
            html: '<h2>Reminders</h2>'
        },
        {
            html: '@{message}'
        },
        {
            xtype: 'container',
            layout: {
                type: 'vbox'
            }
//            items: '@{notifications}'
        }
    ]
});