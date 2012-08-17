describe('UI Control: label', function () {
    Given('a view with container that contains items (more containers)', function () {
        var view, vm, itemId;
        itemId = Ext.id();
        Meaning(function () {
            testNs = {
                models:{

                },
                viewmodels:{
                    tester:{
                        htmlSnippet:'<h1>Hello, from</h1>'
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
                                xtype:'label',
                                html:'@{htmlSnippet}'
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
        ShouldHave('set the label html value to the initial viewmodel value.  ', function () {
            expect(Ext.getCmp(itemId).getHtml()).toEqual('<h1>Hello, from</h1>')
        });
        ShouldHave('set the label html value to the updated viewmodel value.  ', function () {
            vm.set('htmlSnippet','<h1>Hello, from Glu!!!</h1>');
            expect(Ext.getCmp(itemId).getHtml()).toEqual('<h1>Hello, from Glu!!!</h1>')
        });
    });
});