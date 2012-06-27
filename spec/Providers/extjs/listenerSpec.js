describe('listener spec', function () {
    describe('given an item wired by click listener to an action', function () {
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
                                id:buttonId,
                                text:'Go',
                                listeners:{
                                    click:'@{go}'
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
        describe('when a user clicks the button', function () {
            beforeEach(function () {
                exthelper.click(buttonId);
            });
            it('The corresponding action should fire', function () {
                expect(vm.go).toHaveBeenCalled();
            });
        });
    });
});