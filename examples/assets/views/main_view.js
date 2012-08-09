glu.defView('examples.assets.main', {
    title:'@{title}',
    layout:'border',
    tbar : ['cloneSet',{xtype:'tbfill'},'openOptions'],
    items:[
//        {
//            layout:{
//                type: 'vbox',
//                align : 'stretch'
//            },
//            region:'west',
//            width:400,
//            defaults : {
//                height:200,
//                cls : 'panel-focus-@{isFocused}'
//            },
//            items:'@{assetSetList}',
//            activeItem:'@{assetSetWithFocus}'
//        },
        {
            xtype:'tabpanel',
            items:'@{assetSetList}',
            activeTab:'@{assetSetWithFocus}',
            region:'center'
        },
        {
            name:'detail',
            xtype:'@{detail}',
            region:'east',
            width: 300
        }
    ]
});