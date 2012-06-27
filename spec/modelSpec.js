describe('view model tests', function () {
    xdescribe('given a model with a submodel that is already instantiated', function () {
        it('should throw an error because that is not allowed', function () {
            expect(
                function () {
                    testNs = {
                        viewmodels:{
                            tester:{
                                badStore:new Ext.data.ArrayStore({
                                    fields:['name', 'value']
                                })
                            }
                        }
                    };
                    vm = glu.model({
                        ns:'testNs',
                        mtype:'tester'
                    });
                }).toThrow();
        });
    });
    //composiiton
    describe('given a viewmodel with a nested viewmodel referenced by mtype name and a random subobject', function () {
        var vm, view;
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    subtester:{
                        color:'green'
                    },
                    tester:{
                        mySubtester:{
                            mtype:'subtester'
                        },
                        randomSubObject:{}
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            vm.init();

        });

        it('the sub model should have been instantiated', function () {
            expect(vm.mySubtester.get('color')).toEqual('green');
        });
        describe('when setting random sub-object (not a submodel) to new value', function () {
            beforeEach(function () {
                vm.set('randomSubObject', {value:'yay'});
            });
            it('Should just replace reference to the random object', function () {
                expect(vm.get('randomSubObject').value).toEqual('yay');
            })
        })


    });
    describe('given a viewmodel with a nested viewmodel referenced by mtype name and an additional property', function () {
        var vm, view;
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    subtester:{
                        color:'green'
                    },
                    tester:{
                        mySubtester:{
                            mtype:'subtester',
                            color:'blue',
                            otherColor:'red'
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

        it('the sub model should have been instantiated with the property override', function () {
            expect(vm.mySubtester.get('color')).toEqual('blue');
        });
        it('the sub model should have the mixed-in property', function () {
            expect(vm.mySubtester.get('otherColor')).toEqual('red');
        })

    });
    describe('given a viewmodel with a property called happy initialized to false', function () {
        var vm, view, itemId, testReactor = jasmine.createSpy('testReactor');
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    tester:{
                        isHappy:false,
                        testReactor:{
                            on:['isHappyChanged'],
                            action:testReactor                        }
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
    describe('given a viewmodel with a property called isHappy initialized to false AND a setIsHappy custom setter', function () {
        var vm, view, itemId;
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    tester:{
                        isHappy:false,
                        setIsHappy:jasmine.createSpy('setIsHappy')
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            vm.init();

        });
        describe('when the isHappy property is set to true using .set()', function () {
            beforeEach(function () {
                vm.set('isHappy', true);
            });
            it('setIsHappy should have been called', function () {
                expect(vm.setIsHappy).toHaveBeenCalled();
            });
            it('setIsHappy should have rejected the change and isHappy remains false', function () {
                expect(vm.get('isHappy')).toEqual(false);
            })
        });
        describe('when the isHappy property is set to true using .setIsHappy()', function () {
            beforeEach(function () {
                vm.setIsHappy(true);
            });
            it('setIsHappy should have been called', function () {
                expect(vm.setIsHappy).toHaveBeenCalled();
            });
            it('setIsHappy should have rejected the change and isHappy remains false', function () {
                expect(vm.get('isHappy')).toEqual(false);
            })
        });
    });
});
