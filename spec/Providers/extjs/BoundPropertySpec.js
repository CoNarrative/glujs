describe('given a control with an arbitrary property wired to a property on the model', function () {
    // go through all of our glu interfaces and make sure that the ExtJs 3.4.0 provider implements them
    var vm, view, itemId;
    beforeEach(function () {
        itemId = Ext.id();
        testNs = {
            viewmodels:{
                tester:{
                    itemDisabled:false
                }
            },
            views:{
                tester:{
                    items:[
                        {
                            id:itemId,
                            xtype:'textfield',
                            disabled:'@{itemDisabled}'
                        }
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
    it('the original model should have itemDisable false', function () {
        expect(vm.get('itemDisabled')).toEqual(false);
    });
    it('the original view should have disabled false', function () {
        expect(Ext.getCmp(itemId).disabled).toEqual(false);
    });

    describe('when the model changes', function () {
        beforeEach(function () {
            vm.set('itemDisabled', true);
        });
        it('The corresponding control property matches', function () {
            expect(Ext.getCmp(itemId).disabled).toEqual(true);
        });
    });
});

describe('given a control with an arbitrary property wired with a one-way formula', function () {
    // go through all of our glu interfaces and make sure that the ExtJs 3.4.0 provider implements them
    var vm, view, itemId;
    beforeEach(function () {
        itemId = Ext.id();
        testNs = {
            viewmodels:{
                tester:{
                    itemDisabled:false
                }
            },
            views:{
                tester:{
                    items:[
                        {
                            id:itemId,
                            xtype:'textfield',
                            value:'foo @{itemDisabled} bar'
                        }
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
    it('the original model should be set to false', function () {
        expect(vm.get('itemDisabled')).toEqual(false);
    });
    it('the original view should have text set to the formula', function () {
        expect(Ext.getCmp(itemId).value).toEqual('foo false bar');
    });

    describe('when the model changes', function () {
        beforeEach(function () {
            vm.set('itemDisabled', true);
        });
        it('The corresponding control property formula recalculates', function () {
            expect(Ext.getCmp(itemId).value).toEqual('foo true bar');
        });
    });
});