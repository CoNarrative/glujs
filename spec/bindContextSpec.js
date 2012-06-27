describe('given a view with a bindContext defined', function () {
    var vm, view, itemId;
    beforeEach(function () {
        itemId = Ext.id();
        testNs = {
            models:{
                transaction:{
                    name:'transaction',
                    idProperty:'id',
                    fields:[
                        {name:'id', dataIndex:'id', type:'string'},
                        {name:'attachments', dataIndex:'attachments', type:'number'},
                        {name:'amount', dataIndex:'amount', type:'number', defaultValue:0},
                        {name:'currencyCode', dataIndex:'currencyCode', type:'string', defaultValue:'USD', list:'currencyCode'}
                    ]
                }
            },
            viewmodels:{
                tester:{
                    transactionSelections:[],
                    transactionStore:{
                        mtype:'arraystore',
                        fields:['id', 'attachments', 'amount', 'currencyCode'],
                        data:[
                            ['1234', 2, 400, 'USD']
                        ]
                    },
                    selectedItem:{
                        mtype:'viewmodel',
                        recType:'transaction'
                    },
                    init:function () {
                        this.selectedItem.loadData(this.transactionStore.getAt(0).data);
                    }
                }
            },
            views:{
                tester:{
                    xtype:'panel',
                    items:[
                        {
                            xtype:'grid',
                            store:'@{transactionStore}',
                            sm:{xtype:'checkboxsm'},
                            columns:[
                                {dataIndex:'id'}
                            ],
                            selections:'@{transactionSelections}'
                        },
                        {
                            xtype:'panel',
                            bindContext:'selectedItem',
                            items:[
                                {
                                    id:itemId,
                                    xtype:'textfield',
                                    name:'id'
//                                },
//                                {
//                                    id: itemId + '_attachments',
//                                    xtype:'changetrackedfield',
//                                    name: '@{attachments}'
                                }
                            ]
                        }
                    ]
                }
            }
        };
        vm = glu.model({
            ns:'testNs',
            mtype:'tester'
        });
        view = glu.view(vm, 'testNs', 'tester');


    });
    it('The corresponding control value should match the sub viewmodel value', function () {
        expect(Ext.getCmp(itemId).value).toEqual(vm.selectedItem.get('id'));
//        expect(Ext.getCmp(itemId+'_attachments').value).toEqual(vm.selectedItem.get('attachments'));
    });
});
