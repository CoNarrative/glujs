glu.defView('ps.main', {
    fullscreen: true,
    layout: {
        type: 'vbox',
//        pack: 'center'
    },
    items: [
    /** TitleBar **/
        {
            xtype: 'titlebar',
            docked: 'top',
            title: '~~Customer Connect~~',
            items: [
                {
                    xtype: 'button',
                    hidden: false,
                    cls: 'icon-cog',
                    align: 'right'
                }
            ]
        },
        {
            xtype: 'panel',
            layout: {
                type: 'vbox'
            },
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'card'
                    },
                    height: 500,
                    weight: 500,
                    /**Notification Container**/
//                    items:[{html:'Hello'}]
                    items: '@{screens}',
                    activeItem: '@{activeScreen}'
                }
            ]
        }
    ]
});
glu.defView('ps.home', {
    xtype: 'container',
    cls: 'notification_container',
    layout: {
        type: 'vbox'
    },
    height: 500,
    weight: 500,
    items: [
        {
            html: '<h2>Notifications</h2>'
        },
        {
            xtype: 'container',
            layout: {
                type: 'vbox',
                pack: 'middle',
            },
            items: '@{notificationSummaryList}'
        },
//        {
//            xtype: 'button',
//            listeners: {
//                event: 'tap',
//                fn: '@{updateActiveScreen}'
//            }
//        }
    ]
});
glu.defView('ps.notification', {
    xtype: 'container',
    layout: {
        type: 'vbox'
    },
    height: 500,
    weight: 500,
    items: [
        {html: 'Notification details'}

    ]
});
