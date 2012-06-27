describe('given the autofield plugin', function () {
    var plugin, vm, view, itemId;
    beforeEach(function () {
        //TODO: Better way of registering plugin...
        glu.clearPlugins();
        //glu.on('beforecollect', glu.provider.AutoFieldPlugin());
    });
    describe('when a view component is instantiated', function () {
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                lookups:{
                    currencyCode:new Ext.data.ArrayStore({
                        data:[
                            {display:'US Dollars', value:'USD'},
                            {display:'Euros', value:'EUR'}
                        ],
                        fields:['display', 'value']
                    })
                },
                models:{
                    transaction:{
                        name:'transaction',
                        idProperty:'id',
                        defaultType:'autofield',
                        fields:[
                            {
                                name:'id',
                                dataIndex:'id',
                                type:'string'
                            },
                            {
                                name:'attachments',
                                dataIndex:'attachments',
                                type:'number'
                            },
                            {
                                name:'description',
                                type:'string'
                            },
                            {
                                name:'isPending',
                                type:'boolean'
                            },
                            {
                                name:'amount',
                                dataIndex:'amount',
                                type:'number',
                                defaultValue:0
                            },
                            {
                                name:'currencyCode',
                                dataIndex:'currencyCode',
                                type:'string',
                                defaultValue:'USD',
                                lookup:'currencyCode'
                            }
                        ]
                    }
                },
                viewmodels:{
                    portal:{
                        selectedTx:{
                            mtype:'viewmodel',
                            recType:'transaction'
                        }
                    }
                },
                views:{
                    portal:{
                        bindContext:'selectedTx',
                        defaultType:'autofield',
                        items:[
                            {
                                id:itemId,
                                name:'isPending'
                            },
                            {
                                name:'currencyCode'
                            },
                            'amount',
                            'id',
                            'description'
                        ]
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'portal'
            });
            view = glu.view(vm, 'testNs', 'portal');
        });
        it('the boolean value should be a checkbox', function () {
            expect(view.items.get(0).xtype).toEqual('checkbox');
        });
        it('the lookup value should be a combo', function () {
            expect(view.items.get(1).xtype).toEqual('combo');
        });
        it('the amount should be a numberfield', function () {
            expect(view.items.get(2).xtype).toEqual('numberfield');
        });
        it('the id should be a displayfield', function () {
            expect(view.items.get(3).xtype).toEqual('displayfield');
        });
        it('the description should be a textfield', function () {
            expect(view.items.get(4).xtype).toEqual('textfield');
        });
        it('the lookup value should be bound to a store', function () {
            expect(view.items.get(1).store).toEqual(testNs.lookups.currencyCode);
        });
    });
});
