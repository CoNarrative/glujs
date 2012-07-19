glu.defView('examples.assets.main', {
    title:'@{title}',
    layout:'border',
    tbar : ['cloneSet',{xtype:'tbfill'},'openOptions'],
    items:[
        {
            layout:'card',
            items:'@{assetSetList}',
            activeItem:'@{assetSetWithFocus}',
            region:'west',
            width:300
        },
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
            width:400
        }
    ]
});