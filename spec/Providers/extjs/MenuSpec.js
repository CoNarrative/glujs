describe('given a menu wired by name to an action', function () {
    // go through all of our glu interfaces and make sure that the ExtJs 3.4.0 provider implements them
    var vm, view, buttonId;
    beforeEach(function () {
        buttonId = Ext.id();
        testNs = {
            viewmodels:{
                buttonTester:{
                    go:jasmine.createSpy('go command')
                }

            },
            views:{
                buttonTester:{
                    tbar:[
                        {
                            text:'Actions',
                            menu:{
                                items:[
                                    {
                                        id:buttonId,
                                        text:'Go',
                                        name:'go'
                                    }
                                ]
                            }
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
    });
    it ('should have default type of menuitem on sub-items',function (){
       expect (Ext.getCmp(buttonId).xtype).toBe('menuitem');
    });
    describe('when a user clicks the menuitem', function () {
        beforeEach(function () {
            exthelper.click(buttonId);
        });
        it('The corresponding action should fire', function () {
            expect(vm.go).toHaveBeenCalled();
        });
    });
});
