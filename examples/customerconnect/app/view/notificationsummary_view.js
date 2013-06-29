glu.defView('ps.notificationSummary', {
    xtype: 'container',
    cls:'notification',
    layout: {
        type: 'hbox'
    },
    items: [
        {
            xtype:'label',
            html:'@{count}'

        },
        {
            xtype:'label',
            html:'@{message}'
        }
    ]
});