describe('UI Control: checkboxfield', function () {
    Given('a view with checkboxfield that has value & name (bind context) properties bound to a viewmodel properties', function () {
        var view, vm, itemId;
        itemId = Ext.id();
        Meaning(function () {
            testNs = {
                locale:{
                    filterOption1:'Filter by Active'

                },
                models:{

                },
                viewmodels:{
                    tester:{
                        filterOption1:false
                    }
                },
                views:{
                    tester:{
                        xtype:'container',
                        items:[
                            {
                                xtype:'container'

                            },
                            {   id:itemId,
                                name:'filterOption1',
                                xtype:'checkboxfield'
                            }
                        ]
                    }
                }
            };

            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            vm.init();
            view = glu.view(vm, 'testNs', 'tester');

        });
        ShouldHave('set the checkbox label to the localized value.', function () {
            expect(Ext.getCmp(itemId).getLabel()).toEqual('Filter by Active')
        });

        ShouldHave('set the checkbox checked value to the initial value of true using the value property', function () {
            expect(Ext.getCmp(itemId).getChecked()).toEqual(false)
        });

//        ShouldHave('set the viewmodel filterOption1 to true in response to the UI',function(){
//            Ext.getCmp(itemId).setChecked(true);
//            expect(vm.filterOption1).toEqual(true);
//        });
    });
});