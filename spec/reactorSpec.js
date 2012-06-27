describe('reactor tests', function () {
    describe('given a viewmodel with a reactor bound to a property change', function () {
        var vm, view, itemId, testReactor = jasmine.createSpy('testReactor');
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    tester:{
                        isHappy:false,
                        testReactor:{
                            on:['isHappyChanged'],
                            action:testReactor
                        }
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            vm.init();

        });
        describe('when the isHappy property is set to true', function () {
            beforeEach(function () {
                vm.set('isHappy', true);
            });
            it('now should return true', function () {
                expect(vm.get('isHappy')).toEqual(true);
            });
            it('the reactor should have been triggered', function () {
                expect(testReactor).toHaveBeenCalled();
            })
        })
    });
    describe('given a viewmodel with a reactor bound to a property change on a child model', function () {
        var vm, view, itemId, testReactor = jasmine.createSpy('testReactor');
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    tester:{
                        child:{
                            mtype:'viewmodel',
                            isHappy:false
                        },
                        testReactor:{
                            on:['child.isHappyChanged'],
                            action:testReactor
                        }
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            vm.init();

        });
        describe('when the isHappy property is set to true', function () {
            beforeEach(function () {
                vm.child.set('isHappy', true);
            });
            it('now should return true', function () {
                expect(vm.child.get('isHappy')).toEqual(true);
            });
            it('the reactor should have been triggered', function () {
                expect(testReactor).toHaveBeenCalled();
            })
        })
    });
    describe('given an isValid formula bound by formula shortcut)', function () {
        var vm, view, itemId, testReactor = jasmine.createSpy('testReactor');
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    tester:{
                        isHappy:false,
                        isHappyIsValid$:function () {
                            return Ext.isBoolean(this.get('isHappy'));
                        }
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            vm.init();

        });
        it('the isValid formula should be true', function () {
            expect(vm.get('isHappyIsValid')).toEqual(true);
        });
        it('the global isValid should be true', function () {
            expect(vm.get('isValid')).toEqual(true);
        });
        describe('when the isHappy property is set to an invalid value', function () {
            beforeEach(function () {
                vm.set('isHappy', 'foo');
            });
            it('now the isValid should return false', function () {
                expect(vm.get('isHappyIsValid')).toEqual(false);
            });
            it('the global isValid should be false', function () {
                expect(vm.get('isValid')).toEqual(false);
            });
            describe('when the isHappy property is set back a valid value', function () {
                beforeEach(function () {
                    vm.set('isHappy', true);
                });
                it('now should return true', function () {
                    expect(vm.get('isHappyIsValid')).toEqual(true);
                });
                it('the global isValid should be true', function () {
                    expect(vm.get('isValid')).toEqual(true);
                });
            });
        });
    });
    describe('given a formula bound by trailing dollar-sign shortcut', function () {
        var vm, view, itemId, testReactor = jasmine.createSpy('testReactor');
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    tester:{
                        isHappy:false,
                        isHappyIsCool$:function () {
                            return Ext.isBoolean(this.get('isHappy'));
                        }
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            vm.init();

        });
        it('the isHappyIsCool formula should be true', function () {
            expect(vm.get('isHappyIsCool')).toEqual(true);
        });
        describe('when the isHappy property is set to an uncool value', function () {
            beforeEach(function () {
                vm.set('isHappy', 'foo');
            });
            it('now should return false', function () {
                expect(vm.get('isHappyIsCool')).toEqual(false);
            });
            describe('when the isHappy property is set back a cool value', function () {
                beforeEach(function () {
                    vm.set('isHappy', true);
                });
                it('now should return true', function () {
                    expect(vm.get('isHappyIsCool')).toEqual(true);
                });
            });
        });
    });
    describe('given a formula bound by trailing dollar-sign shortcut nested deeply', function () {
        var vm, view, itemId, testReactor = jasmine.createSpy('testReactor');
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    tester:{
                        subModelA : {
                            mtype : 'viewmodel',
                            subModelB : {
                                mtype : 'viewmodel',
                                isHappy : true
                            }
                        },
                        isHappyIsCool$:function () {
                            return Ext.isBoolean(this.subModelA.subModelB.isHappy);
                        }
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            vm.init();

        });
        it('the isHappyIsCool formula should be true', function () {
            expect(vm.get('isHappyIsCool')).toEqual(true);
        });
        describe('when the isHappy property is set to an uncool value', function () {
            beforeEach(function () {
                vm.subModelA.subModelB.set('isHappy', 'foo');
            });
            it('now should return false', function () {
                expect(vm.get('isHappyIsCool')).toEqual(false);
            });
            describe('when the isHappy property is set back a cool value', function () {
                beforeEach(function () {
                    vm.subModelA.subModelB.set('isHappy', true);
                });
                it('now should return true', function () {
                    expect(vm.get('isHappyIsCool')).toEqual(true);
                });
            });
        });
    });
});

