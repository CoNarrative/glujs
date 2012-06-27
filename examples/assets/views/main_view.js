glu.defView('examples.assets.main', {
    title:'~~title~~',
    layout:'border',
    tbar : ['openOptions'],
    items:[
        {
            xtype:'tabpanel',
            name:'assetSetList',
            region:'center'
        },
        {
            name:'detail',
            xtype:'@{detail}',
            region:'east',
            width:400
        }
    ]
});