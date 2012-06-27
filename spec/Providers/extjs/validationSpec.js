describe('validation specs', function () {

    describe('given a text field with a boolean validation function', function () {
        var vm, view, itemId;

        function standUp(initialStatus) {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    validationTest:{
                        status:initialStatus,
                        statusIsValid:{
                            on:['statusChanged'],
                            formula:function () {
                                return this.get('status') == 'GOOD' || this.get('status') == 'BAD'
                            }
                        }
                    }
                },
                views:{
                    validationTest:{
                        items:[
                            {
                                xtype:'textfield',
                                id:itemId,
                                name:'status',
                                invalidText:'WRONG'
                            }
                        ]
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'validationTest'
            });
            view = glu.view(vm, 'testNs', 'validationTest');
        }

        ;

        xdescribe('and the isValid property starts off as true (invalid)', function () {
            beforeEach(function () {
                standUp('WEIRD');
            });
            it('the button should begin disabled', function () {
                expect(Ext.getCmp(itemId).disabled).toEqual(true);
            });
            describe('when the guard property becomes true', function () {
                beforeEach(function () {
                    vm.set('status', true);
                });
                it('The button should become enabled', function () {
                    expect(Ext.getCmp(itemId).disabled).toEqual(false);
                });
            })
        });
        describe('and the isValid property starts off as true (valid)', function () {
            beforeEach(function () {
                standUp('GOOD');
            });
            it('the field should begin valid', function () {
                expect(Ext.getCmp(itemId).activeError).toEqual(null);
            });
            describe('when the valid property becomes false', function () {
                beforeEach(function () {
                    vm.set('status', 'WEIRD');
                });
                it('The field should become invalid', function () {
                    expect(Ext.getCmp(itemId).activeError).toContain('WRONG');
                });
                describe('then when it goes back again to valid', function () {
                    beforeEach(function () {
                        vm.set('status', 'BAD');
                    });
                    it('The field should become valid', function () {
                        expect(Ext.getCmp(itemId).activeError).toEqual(null);
                    });
                })
            })
        });
    });
});
