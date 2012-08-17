describe('UI Control: textfield', function () {
    Given('a view with container that contains items (more containers)', function () {
        var view, vm, itemId;
        itemId = Ext.id();
        Meaning(function () {
            testNs = {
                locale:{
                    searchInput:'Enter your message'
                },
                models:{

                },
                viewmodels:{
                    tester:{
                        searchInput:'Hello',
                        boo:'asdfasf'
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
                                xtype:'textfield',
                                name:'searchInput'
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
            view = glu.view(vm,'testNs','tester');

        });
        ShouldHave('set the textfield label to the localized value.', function () {
            expect(Ext.getCmp(itemId).getLabel()).toEqual('Enter your message')
        });
//        //SetValue does not fire the change event.
//        ShouldHave('set the message viewmodel property value to entered text.', function () {
//            var control = Ext.getCmp(itemId);
//            control.setValue("Joe's computer");
//            expect(vm.searchInput).toEqual("Joe's computer")
//        });
    });
});