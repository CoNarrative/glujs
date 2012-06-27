describe('given a view with a panel', function () {
    var vm, view, itemId;
    beforeEach(function () {
        itemId = Ext.id();
        testNs = {
            viewmodels:{
                tester:{
                    testData:null,
                    init:function () {
                        this.set('testData', {prop1:'one', prop2:2});
                    }
                }
            },
            views:{
                tester:{
                    xtype:'panel',
                    items:[
                        {
                            xtype:'panel',
                            tpl:new Ext.XTemplate('Prop1:{prop1}'),
                            data:'@{testData}'

                        }
                    ]
                }
            }
        };
        vm = glu.model('testNs.tester');
        vm.init();
        view = glu.view(vm);


    });
    it('The panel template has initial values', function () {
        expect(view.items.get(0).data.prop1).toEqual('one');
        expect(view.items.get(0).data.prop2).toEqual(2);
        //expect()
        // expect(Ext.getCmp(itemId).value).toEqual(vm.selectedItem.get('id'));
//        expect(Ext.getCmp(itemId+'_attachments').value).toEqual(vm.selectedItem.get('attachments'));
    });

    xit('The panel template data object should be updated when model is changed', function () {
        vm.setTestData({prop1:'newValue', prop2:3});
        expect(view.items.get(0).data.prop1).toEqual('newValue');
        expect(view.items.get(0).data.prop2).toEqual(3);
        //expect()
        // expect(Ext.getCmp(itemId).value).toEqual(vm.selectedItem.get('id'));
//        expect(Ext.getCmp(itemId+'_attachments').value).toEqual(vm.selectedItem.get('attachments'));
    });
});

