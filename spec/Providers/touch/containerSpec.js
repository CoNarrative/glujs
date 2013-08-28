describe('Adatpers: Container', function () {
    Given('a view with container that contains items (more containers)', function () {
        var view, vm, itemId;
        Meaning(function () {
            testNs = {
                models:{

                },
                viewmodels:{
                    tester:{

                    }
                },
                views:{
                    tester:{
                        xtype:'container',
                        items:[
                            {
                                xtype:'container'
                            }
                        ]
                    }
                }
            };

            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });


        });
        ShouldHave('called: beforeCreate, afterCreate, and beforeCollect ',function(){
            //Set up spy for Container Adapter
            var adapter = glu.provider.adapters['container'];

            spyOn(adapter,'beforeCollect');
            spyOn(adapter,'beforeCreate');
            spyOn(adapter,'afterCreate');


            view = glu.view(vm);

            expect(adapter.beforeCollect).toHaveBeenCalled();
            expect(adapter.beforeCreate).toHaveBeenCalled();
            expect(adapter.afterCreate).toHaveBeenCalled();
        })
    });
});