describe('button specs', function () {
    describe('given a named button at the same bindContext as the viewmodel containing the matching action', function () {
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
                                name:'go'
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
    describe('given a named button whose command is further up the model chain', function () {
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
                                name:'go'
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
    describe('given a named button with multiple matching actions up the model chain', function () {
        var vm, view, buttonId;
        beforeEach(function () {
            buttonId = Ext.id();
            testNs = {
                viewmodels:{
                    portal:{
                        go:jasmine.createSpy('top level go action'),
                        children:{
                            mtype:'viewmodelactivator',
                            items:[
                                {
                                    mtype:'buttonTester'
                                }
                            ]
                        }
                    },
                    buttonTester:{
                        go:jasmine.createSpy('lower level go action')
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
                                name:'go'
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
            it('Only the first action should fire', function () {
                expect(vm.go).wasNotCalled();
                expect(vm.children.getAt(0).go).toHaveBeenCalled();
            });
        });
    });
    describe('given a named button with a value', function () {
        var vm, view, buttonId;
        beforeEach(function () {
            buttonId = Ext.id();
            testNs = {
                viewmodels:{
                    buttonTester:{
                        go:jasmine.createSpy()
                    }
                },
                views:{
                    buttonTester:{
                        tbar:[
                            {
                                id:buttonId,
                                text:'Go',
                                name:'go',
                                value:'fast'
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
            it('The corresponding action should fire with the passed value', function () {
                expect(vm.go.mostRecentCall.args[0]).toEqual('fast');
            });
        });
    });
    describe('given a toggle button with pressed bound to a boolean variable', function () {
        var vm, view, buttonId;
        beforeEach(function () {
            buttonId = Ext.id();
            testNs = {
                viewmodels:{
                    buttonTester:{
                        isHappy:true
                    }
                },
                views:{
                    buttonTester:{
                        tbar:[
                            {
                                id:buttonId,
                                text:'Happy',
                                enableToggle:true,
                                pressed:'@{isHappy}'
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
        it('the button should begin pressed', function () {
            expect(Ext.getCmp(buttonId).pressed).toEqual(true);
        });
        describe('when a user clicks the button and "untoggles" it', function () {
            beforeEach(function () {
                exthelper.click(buttonId);
            });
            it('The corresponding property should no longer be true', function () {
                expect(vm.get('isHappy')).toEqual(false);
            });
        });
        describe('when the bound propery changes, expect button to be "untoggled"', function () {
            beforeEach(function () {
                vm.set('isHappy', false);
            });
            it('The corresponding property should no longer be true', function () {
                expect(Ext.getCmp(buttonId).pressed).toEqual(false);
            });
        });
    });
    describe('given a named button with a guard action', function () {
        var vm, view, buttonId;

        function standUp(initialGuardValue) {
            buttonId = Ext.id();
            testNs = {
                viewmodels:{
                    buttonTester:{
                        go:jasmine.createSpy('go command'),
                        goIsEnabled:initialGuardValue
                    }
                },
                views:{
                    buttonTester:{
                        tbar:[
                            {
                                id:buttonId,
                                name:'go'
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
        }

        ;

        describe('and the guard property starts off as false (disabled)', function () {
            beforeEach(function () {
                standUp(false);
            });
            it('the button should begin disabled', function () {
                expect(Ext.getCmp(buttonId).disabled).toEqual(true);
            });
            describe('when the guard property becomes true', function () {
                beforeEach(function () {
                    vm.set('goIsEnabled', true);
                });
                it('The button should become enabled', function () {
                    expect(Ext.getCmp(buttonId).disabled).toEqual(false);
                });
            })
        });
        describe('and the guard property starts off as true (enabled)', function () {
            beforeEach(function () {
                standUp(true);
            });
            it('the button should begin enabled', function () {
                expect(Ext.getCmp(buttonId).disabled).toEqual(false);
            });
            describe('when the guard property becomes false', function () {
                beforeEach(function () {
                    vm.set('goIsEnabled', false);
                });
                it('The button should become disabled', function () {
                    expect(Ext.getCmp(buttonId).disabled).toEqual(true);
                });
            })
        });
    });
});
