glu.defView('ps.notificationSummary', {
    xtype: 'container',
    cls: 'notification',
    layout: {
        type: 'hbox'
    },
    listeners: [
        {
            event: 'tap',
            element: 'element',
//            fn: '@{updateActiveScreen}'
//           TODO:  Replace this with declarative syntax on fn
            fn: function () {
                this._vm.updateActiveScreen();
            }
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

glu.defView('ps.notificationSummaryDetail', {
    xtype: 'container',
    layout: {
        type: 'vbox'
    },
    height: 500,
    weight: 500,
    items: [
        {
            html: '<h2>Summary Detail</h2>'
        },
        {
            html: '@{message}'
        }
    ]
});