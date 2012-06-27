describe('field specs', function () {
    var plugin, vm, view, itemId, buttonId;
    describe('given a field bound by name and missing a fieldLabel', function () {
        beforeEach(function () {
            itemId = Ext.id();
            buttonId = Ext.id();
            testNs = {
                locale:{
                    id:'Le Id',
                    edit:'Le Edit'
                },

                viewmodels:{
                    portal:{
                        id:'27',
                        edit:function () {
                        }
                    }
                },
                views:{
                    portal:{
                        items:[
                            {
                                id:itemId,
                                name:'id',
                                xtype:'displayfield'
                            },
                            {
                                id:buttonId,
                                name:'edit',
                                xtype:'button'
                            }
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
        it('(the field) should have a localized field label automatically applied', function () {
            expect(Ext.getCmp(itemId).fieldLabel).toEqual('Le Id');
        });
        it('(the button) should have a localized text label automatically applied', function () {
            expect(Ext.getCmp(buttonId).text).toEqual('Le Edit');
        });
    });
});
