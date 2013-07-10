glu.defView('ps.notification', {
    xtype: 'container',
    layout: {
        type: 'vbox'
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