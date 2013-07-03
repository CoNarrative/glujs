glu.defView('ps.notification', {
    xtype: 'container',
    layout: {
        type: 'vbox'
    },

    items: [
        {
            html:'Notification '
        },
        {
            xtype: 'label',
            html:'@{type}'
        }
    ]
});