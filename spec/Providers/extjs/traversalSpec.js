describe('given an item property explicitly wired to a parent', function () {
    var vm, view, itemId;
    beforeEach(function () {
        itemId = Ext.id();
        testNs = {
            viewmodels:{
                portal:{
                    statusText:'GOOD',
                    children:{
                        mtype:'viewmodelactivator',
                        autoParent:true,
                        items:[
                            {
                                mtype:'childModule'
                            }
                        ]
                    }
                },
                childModule:{

                }
            },
            views:{
                portal:{
                    xtype:'tabpanel',
                    name:'children'
                },
                childModule:{
                    items:[
                        {
                            id:itemId,
                            xtype:'textfield',
                            value:'@{parentVM.statusText}'
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
    it("it's initial value should match parent model property", function () {
        expect(Ext.getCmp(itemId).getValue()).toEqual('GOOD');
    });
    describe('when the model value changes', function () {
        beforeEach(function () {
            vm.set('statusText', 'BAD');
        });
        it('the control value should change as usual', function () {
            expect(Ext.getCmp(itemId).getValue()).toEqual('BAD');
        });
    });
});
describe('given an item property with an auto-up wiring', function () {
    var vm, view, itemId;
    beforeEach(function () {
        itemId = Ext.id();
        testNs = {
            viewmodels:{
                portal:{
                    statusText:'GOOD',
                    children:{
                        mtype:'viewmodelactivator',
                        autoParent:true,
                        items:[
                            {
                                mtype:'childModule'
                            }
                        ]
                    }
                },
                childModule:{

                }
            },
            views:{
                portal:{
                    xtype:'tabpanel',
                    name:'children'
                },
                childModule:{
                    items:[
                        {
                            id:itemId,
                            xtype:'textfield',
                            value:'@{..statusText}'
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
    it("it's initial value should match parent model property", function () {
        expect(Ext.getCmp(itemId).getValue()).toEqual('GOOD');
    });
    describe('when the model value changes', function () {
        beforeEach(function () {
            vm.set('statusText', 'BAD');
        });
        it('the control value should change as usual', function () {
            expect(Ext.getCmp(itemId).getValue()).toEqual('BAD');
        });
    });
});

