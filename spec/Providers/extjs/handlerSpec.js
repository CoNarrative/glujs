describe('given a button wired by handler to an action', function () {
    // go through all of our glu interfaces and make sure that the ExtJs 3.4.0 provider implements them
    var vm, view, buttonId;
    beforeEach(function () {
        buttonId = Ext.id();
        testNs = {
            viewmodels:{
                buttonTester:{
                    go:function () {
                        console.log('hey!!!!')
                    }
                }
            },
            views:{
                buttonTester:{
                    tbar:[
                        {
                            id:buttonId,
                            text:'Go',
                            handler:'@{go}'
                        }
                    ]
                }
            }
        };
        vm = glu.model({
            ns:'testNs',
            mtype:'buttonTester'
        });
        view = glu.view(vm, 'testNs', 'buttonTester');
        spyOn(vm, 'go');
    });
    describe('when a user clicks the button', function () {
        beforeEach(function () {
            var button = Ext.getCmp(buttonId);
            button.onClick.call(button, {preventDefault:Ext.emptyFn, button:0});
        });
        it('The corresponding action should fire', function () {
            expect(vm.go).toHaveBeenCalled();
        });
    });
});

describe('given a autoUp-bound named button whose command is further up the model chain', function () {
    var vm, view, buttonId;
    beforeEach(function () {
        buttonId = Ext.id();
        testNs = {
            viewmodels:{
                portal:{
                    go:jasmine.createSpy('top level go action'),
                    children:{
                        mtype:'viewmodelactivator',
                        autoParent:true,
                        items:[
                            {
                                mtype:'buttonTester'
                            }
                        ]
                    }
                },
                buttonTester:{

                }
            },
            views:{
                portal:{
                    xtype:'tabpanel',
                    name:'children'
                },
                buttonTester:{
                    tbar:[
                        {
                            id:buttonId,
                            text:'Go Again',
                            handler:'@{..go}'
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
    describe('when a user clicks the button', function () {
        beforeEach(function () {
            exthelper.click(buttonId);
        });
        it('The corresponding action should fire', function () {
            expect(vm.go).toHaveBeenCalled();
        });
    });
});