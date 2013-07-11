glu.defView('ps.notification', {
    xtype: 'container',
    cls:'notification_detail',
    layout: {
        type: 'hbox'
    },
    items: [
        {
            xtype: 'label',
            html: '@{type}'
        },
        {
            xtype: 'label',
            html: '@{message}'
        },
        {
            xtype: 'label',
            html: '@{name}'
        }
    ]

})
;