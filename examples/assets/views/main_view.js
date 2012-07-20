glu.defView('examples.assets.main', {
    title:'@{title}',
    layout:'border',
    tbar : ['cloneSet',{xtype:'tbfill'},'openOptions'],
    items:[
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