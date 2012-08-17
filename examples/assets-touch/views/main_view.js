glu.defView('examples.assets.main', {
    scrollable:true,
    cls:'x-content',
    items:[
        {
            name:'searchmessage',
            xtype:'textfield'
        },
        {
            xtype:'label',
            html:'@{searchmessage}'
        }
//        {
//            xtype:'titlebar',
//            docked:'top',
//
//            items:[
//                {
//                    text:'JSONP',
//                    align:'left'
//                },
//                {
//                    text:'XMLHTTP',
//                    align:'right'
//                },
//                {
//                    html:'This example can use either JSONP or AJAX to retrieve data.'
//                }
//            ]
//        },
//        {
//            xtype:'toolbar',
//            docked:'bottom',
//            title:'Tap a button above.',
//            ui:'light'
//        }
    ]
});