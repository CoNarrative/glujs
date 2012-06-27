describe('datamodel tests', function () {
    describe('given a dataModel', function () {
        var vm, view, itemId;
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                models:{
                    transaction:{
                        name:'transaction',
                        idProperty:'id',
                        fields:[
                            {name:'id', dataIndex:'id', type:'string'},
                            {name:'attachments', dataIndex:'attachments', type:'number'},
                            {name:'amount', dataIndex:'amount', type:'number', defaultValue:0},
                            {name:'currencyCode', dataIndex:'currencyCode', type:'string', defaultValue:'USD', list:'currencyCode'}
                        ]
                    }
                },
                viewmodels:{
                    tester:{
                        transactionSelections:[],
                        transactionStore:{
                            mtype:'arraystore',
                            fields:['id', 'attachments', 'amount', 'currencyCode'],
                            data:[
                                ['1234', 2, 400, 'USD']
                            ]
                        },
                        selectedItem:{
                            mtype:'viewmodel',
                            recType:'transaction'
                        },
                        init:function () {
                            this.selectedItem.loadData(this.transactionStore.getAt(0).data);
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
        describe('after initial loading', function () {
            it('The data model should be set to the loaded value', function () {
                expect(vm.selectedItem.get('id')).toEqual('1234');
            });
            it('The record should not be dirty', function () {
                expect(vm.selectedItem.get('isDirty')).toEqual(false);
            });
        });
        describe('after setting a value', function () {
            beforeEach(function () {
                vm.selectedItem.set('amount', 999);
            });
            it('The record should now be dirty', function () {
                expect(vm.selectedItem.get('isDirty')).toEqual(true);
            });
        });
        describe('after setting a value and then back to the original value', function () {
            beforeEach(function () {
                vm.selectedItem.set('amount', 999);
                vm.selectedItem.set('amount', 400);
            });
            it('The field should now be clean', function () {
                expect(vm.selectedItem.isModified('amount')).toEqual(false);
            });
            it('The record should now be clean', function () {
                expect(vm.selectedItem.get('isDirty')).toEqual(false);
            });
        });
        describe('when empty data is loaded in through loadData', function () {
            beforeEach(function () {
                vm.selectedItem.loadData({});
            });
            it('Should have cleared all of the data', function () {
                var it = vm.selectedItem;
                expect(it.get('id')).toBe('');
                expect(it.get('attachments')).toBe(0);
                expect(it.get('amount')).toBe(0);

            });
            it('Should have respected default data', function () {
                expect(vm.selectedItem.get('currencyCode')).toBe('USD');
            });
        })
    });

    describe('given a datamodel with a property called happy initialized to false', function () {
        var vm, view, itemId, testReactor = jasmine.createSpy('testReactor');
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    tester:{
                        myCharacter:{
                            mtype:'viewmodel',
                            fields:[
                                {name:'id'},
                                {name:'isHappy', type:'boolean'}
                            ]
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
                vm.myCharacter.set('isHappy', true);
            });
            it('now should return true', function () {
                expect(vm.myCharacter.get('isHappy')).toEqual(true);
            });
        })
    });
    describe('given a datamodel with a property called isHappy initialized to false AND a setIsHappy custom setter', function () {
        var vm, view, itemId, setHappySpy = jasmine.createSpy('setIsHappy');
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    tester:{
                        myCharacter:{
                            mtype:'viewmodel',
                            fields:[
                                {name:'id'},
                                {name:'isHappy', type:'boolean'}
                            ],
                            setIsHappy:setHappySpy
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
        describe('when the isHappy property is set to true using .set()', function () {
            beforeEach(function () {
                vm.myCharacter.set('isHappy', true);
            });
            it('setIsHappy should have been called', function () {
                expect(setHappySpy).toHaveBeenCalled();
            });
            it('setIsHappy should have rejected the change and isHappy remains false', function () {
                expect(vm.myCharacter.get('isHappy')).toEqual(false);
            })
        });
    });
    describe('given a datamodel with an added custom reactor', function () {
        var vm, view, itemId;
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    tester:{
                        myCharacter:{
                            mtype:'viewmodel',
                            fields:[
                                {name:'id'},
                                {name:'isHappy', type:'boolean'}
                            ],
                            color:{
                                on:'isHappyChanged',
                                formula:function () {
                                    return this.isHappy ? 'white' : 'red'
                                }
                            }
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
        describe('when the isHappy property is set to true using .set()', function () {
            beforeEach(function () {
                vm.myCharacter.set('isHappy', true);
            });
            it('the reactor should have fired', function () {
                expect(vm.myCharacter.get('color')).toEqual('white');
            })
        });
    });
});
