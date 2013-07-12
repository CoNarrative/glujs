glu.defView('ps.notification', {
    xtype: 'container',
    cls: 'notification_detail',
    layout: {
        type: 'hbox'
    },
    items: [
        {
            xtype: 'container',
            layout: {
                type: 'vbox'
            },
            flex: 2,
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'label',
                            html: '@{name}',
                            style:{
                                'font-weight':'bold'
                            }
                        },
                        {
                            xtype: 'label',
                            flex: 1,
                            html: '@{subject}',
                            margin:'0 0 0 20'
                        }
                    ]

                },
                {
//                    id:'shortMessage',
                    xtype: 'label',
                    cls:'truncate',
                    html: '@{shortMessage}',
                    margin: '0 0 0 20',
//                    width:'100',
                }
            ]
        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                pack: 'end',
                align: 'start'
            },
            flex: .2,
            items: [
                {
                    xtype: 'label',
                    cls: 'notification_icon',
                    html: '<i class=@{iconClass}></i>',
                    margin: '0 10 0 0'
                }
            ]
        }
    ]
});