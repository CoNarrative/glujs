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
    Given('a viewmodel with a child model', function(){
        var vm, formulaCalled;
        Meaning (function(){
            testNs = {
                viewmodels:{
                    tester:{
                        childWithFocus : {mtype:'childtype'},
                        focusChildAge$ : function(){
                            formulaCalled = true;
                            return this.childWithFocus.age;
                        }
                    },
                    childtype : {
                        age: 1
                    }
                }
            };
            vm = glu.model ('testNs.tester');
        });
        ShouldHave('set parent formula named focusChildAge to 1', function(){
            expect (vm.focusChildAge).toBe(1);
        });
        When ('set the child model age to 2', function(){
            Meaning (function(){
                vm.childWithFocus.set('age',2);
            });
            ShouldHave('set parent formula named focusChildAge to 2', function(){
                expect (vm.focusChildAge).toBe(2);
            });
        });
        When ('replacing the view model with another child aged 3', function(){
            var original;
            Meaning (function(){
                original = vm.childWithFocus;
                vm.set('childWithFocus',vm.model({mtype:'childtype',age:3}));
            });
            ShouldHave('set parent formula named focusChildAge to 3', function(){
                expect (vm.focusChildAge).toBe(3);
            });
            When ('updating the age on the new child to 4', function(){
                Meaning (function(){
                    vm.childWithFocus.set('age',4);
                });
                ShouldHave('set parent formula named focusChildAge to 4', function(){
                    expect (vm.focusChildAge).toBe(4);
                });
            });
            When ('updating the age on the old child to 5', function(){
                Meaning (function(){
                    formulaCalled = false;
                    original.set('age',5);
                });
                ShouldHave('not forced a recalcuation of the formula because no longer watched', function(){
                    expect (formulaCalled).toBe(false);
                });
                ShouldHave('set parent formula named focusChildAge to REMAIN AT 3', function(){
                    expect (vm.focusChildAge).toBe(3);
                });
            });
        });

    })
});
