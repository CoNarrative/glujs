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
            fn: '@{openScreen}'
//           TODO:  Replace this with declarative syntax on fn
//            fn: function () {
//                this._vm.updateActiveScreen('notificationSummaryDetail');
//            }
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
    items: [
        {
            html: '<h2>Summary Detail</h2>'
        },
        {
            html: '@{message}'
        },
        {
            xtype: 'container',
            layout: {
                type: 'vbox'
            },
            items: '@{notifications}'
        }
    ]
});