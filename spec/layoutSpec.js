describe('layouts and embedded views spec', function () {
    describe('given a view with a parent layout to which it provides a button', function () {
        var vm, view, itemId;
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    tester:{
                        go:jasmine.createSpy()
                    }
                },
                views:{
                    masterFactory:function (view) {
                        return {
                            tbar:[view.actionButton]
                        };
                    },
                    tester:{
                        parentLayout:'master',
                        actionButton:{
                            id:itemId,
                            name:'go'
                        }
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            view = glu.view(vm, 'testNs', 'tester');
        });
        describe('when a user clicks the button', function () {
            beforeEach(function () {
                exthelper.click(itemId);
            });
            it('The corresponding action should fire', function () {
                expect(vm.go).toHaveBeenCalled();
            });
        });
    });
    describe('given a view with a statically included named view underneath (items:[xtype:"viewname"])', function () {
        var vm, view, itemId;
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    tester:{
                        go:jasmine.createSpy()
                    }
                },
                views:{
                    childView:{
                        tbar:[
                            {
                                id:itemId,
                                handler:'@{go}'
                            }
                        ]
                    },
                    tester:{
                        items:[
                            {xtype:'childView', title:'myChild'}
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
        it('should have the passed in config parameter ("title")', function () {
            expect(view.items.first().title).toBe('myChild');
        });
        describe('when a user clicks the button that was on the included named view', function () {
            beforeEach(function () {
                exthelper.click(itemId);
            });
            it('The corresponding action should fire', function () {
                expect(vm.go).toHaveBeenCalled();
            });
        });
    });
    describe('given a view with a statically included submodel underneath (items:[{xtype:"@{detail}"}])', function () {
        var vm, view, itemId;
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    character:{
                        save:jasmine.createSpy('save command')
                    },
                    tester:{
                        theHero:{
                            mtype:'character'
                        }
                    }
                },
                views:{
                    character:{
                        items:[
                            {
                                id:itemId,
                                xtype:'button',
                                handler:'@{save}'
                            }
                        ]
                    },
                    tester:{
                        items:[
                            {
                                xtype:'@{theHero}',
                                title:'The Hero'}
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
        it('should have the passed in config parameter ("title")', function () {
            expect(view.items.first().title).toBe('The Hero');
        });
        describe('when a user clicks the button that was on the included submodel', function () {
            beforeEach(function () {
                exthelper.click(itemId);
            });
            it('The corresponding action should fire', function () {
                expect(vm.theHero.save).toHaveBeenCalled();
            });
        });
    });

});
