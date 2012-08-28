describe('given a name-bound combo field', function () {
    var vm, view, itemId;
    beforeEach(function () {
        jasmine.Clock.useMock();
        jasmine.Clock.reset();
        itemId = Ext.id();
        testNs = {
            viewmodels:{
                portal:{
                    statusText:'GOOD',
                    statusChoices:{
                        // reader configs
                        mtype:'arraystore',
                        idIndex:0,
                        fields:['display', 'value'],
                        data:[
                            ['Good', 'GOOD'],
                            ['Bad', 'BAD']
                        ]
                    }
                }
            },
            views:{
                portal:{
                    items:[
                        {
                            id:itemId,
                            xtype:'combo',
                            value:'@{statusText}',
                            store:'@{statusChoices}',
                            valueField:'value',
                            forceSelection:true, //Ext 4.x needs this...
                            valueNotFoundText:'NOTFOUND',
                            displayField:'display'
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
    it("it's initial value should match parent model property", function () {
        expect(Ext.getCmp(itemId).getValue()).toEqual('GOOD');
    });
    // it ('REALITY CHECK: the text should equal the matching display property ',function(){
    // expect(Ext.getCmp(itemId).lastSelectionText).toEqual('Good');
    // });
    describe('when the model value changes', function () {
        beforeEach(function () {
            vm.set('statusText', 'BAD');
            jasmine.Clock.tick(101);
        });
        it('the control value should change as usual', function () {
            expect(Ext.getCmp(itemId).getValue()).toEqual('BAD');
        });
    });
    describe('when the user selects an item', function () {
        beforeEach(function () {
            exthelper.select(itemId, 'BAD');
        });
        it('the control value should change as usual', function () {
            expect(vm.get('statusText')).toEqual('BAD');
        });
    });
    function actualText() {
        if (Ext.getVersion().major > 3) {
            return Ext.getCmp(itemId).rawValue
        } else {
            return Ext.getCmp(itemId).lastSelectionText
        }
    }

    describe('when the initial store choices are empty', function () {
        beforeEach(function () {
            vm.statusChoices.removeAll();
        });
        describe('and the value is set before there are any choices (a race condition)', function () {
            beforeEach(function () {
                Ext.getCmp(itemId).setValue('GOOD');
            });
            it('REALITY CHECK: should refuse to set the value properly', function () {
                expect(actualText()).toEqual('NOTFOUND');
            });
            describe('and THEN the store is loaded', function () {
                beforeEach(function () {
                    vm.statusChoices.loadData([
                        ['Good', 'GOOD'],
                        ['Bad', 'BAD']
                    ]);
                });

                it('Should change text to match loaded value', function () {
                    expect(actualText()).toEqual('Good');
                });
            });
        });
    });
});
