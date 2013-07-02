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

