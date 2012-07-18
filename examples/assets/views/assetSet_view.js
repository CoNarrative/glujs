glu.defView('examples.assets.assetSet', {
    name:'assetList',
    region:'center',
    title:'@{name}',
    xtype:'grid',
    selType:'checkboxmodel',
    closable : '@{isClosable}',
    //TODO: Make binding off of selection object above
    columns:[
        {
            //TODO: Localize column headers
            header:'Name',
            dataIndex:'name'
        },
        {
            header:'Status',
            dataIndex:'status'
        },{
            header:'Years Matter',
            dataIndex:'yearsMatter',
            sortable:false
        }
    ],
    dockedItems:[
        {
            xtype:'pagingtoolbar',
            dock:'bottom',
            store:'@{assetList}',
            page:'@{assetListPage}',
            refreshHandler:'@{refreshAssetList}',
            displayInfo:true
        },
        {
            xtype:'toolbar',
            dock:'top',
            items:['requestVerification', 'removeAssets']
        }
    ]
});