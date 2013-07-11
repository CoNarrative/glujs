/** Entry point **/
glu.defView('ps.main', {
    fullscreen: true,
    layout: {
        type: 'vbox'
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
                },
                {
                    xtype: 'button',
                    hidden: false,
                    align: 'left',
                    text: 'Back',
                    hidden:'@{navigateBackIsHidden}',
                    listeners: [
                        {
                            event: 'tap',
                            fn: '@{navigateBack}'
                        }
                    ]
                }

            ]
        },
//        {
//            xtype: 'panel',
//            layout: {
//                type: 'fit'
//            },
//            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'card'
                    },
                    flex:1,
                    /**Notification Container**/
//                    items:[{html:'Hello'}]
                    items: '@{screens}',
                    activeItem: '@{activeScreen}'
                }
//            ]
//        }
    ]
});

