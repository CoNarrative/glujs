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
                    /**Notification Container**/
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
        }
    ]
});
glu.defView('ps.notification',{
   html:'Notification details '
});
