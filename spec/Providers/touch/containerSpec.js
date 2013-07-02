describe('Adatpers: Container', function () {
    Given('a view with container that contains has a list of viewmodels bound to the items property', function () {
        var view, vm, itemId;
        itemId = Ext.id()
        Meaning(function () {
            testNs1 = {
                models: {

                },
                viewmodels: {
                    main: {
                        init: function () {
                            var screen1 = this.model({mtype: 'screen1'});
                            this.screens.add(screen1);

                            var screen2 = this.model({mtype: 'screen2'});
                            this.screens.add(screen2);
                            this.set('activeScreen', screen1);
                        },
                        screens: {
                            mtype: 'activatorlist',
                            autoParent: true,
                            focusProperty: 'activeScreen'
                        },
                        activeScreen: {mtype: 'screen1'},
                    },
                    screen1: {
                        message: 'Screen1 - prop'
                    },
                    screen2: {
                        message: 'Screen2 - prop'
                    }
                },
                views: {
                    main: {
                        id:itemId,
                        xtype: 'container',
                        layout: {
                            type: 'vbox'
                        },
                        items: '@{screens}'
//                        items:[{html:'asdf'}]
                    },
                    screen1: {
                        xtype: 'container',
                        items: [
                            {
                                html: 'Screen1'
                            }
                        ]
                    },
                    screen2: {
                        xtype: 'container',
                        items: [
                            {
                                html: 'Screen1'
                            }
                        ]
                    }
                }
            };

            vm = glu.model({
                ns: 'testNs1',
                mtype: 'main'
            });
            vm.init();

        });
        ShouldHave('two views within the items property that were bound using ItemsBinding', function () {
            var adapter = glu.provider.adapters['container'];
            view = glu.view(vm);

            expect(view.items.length).toEqual(2);
        });
    });
    Given('a view with container that contains items (more containers)', function () {
        var view, vm, itemId;
        Meaning(function () {
            testNs = {
                models: {

                },
                viewmodels: {
                    tester: {

                    }
                },
                views: {
                    tester: {
                        xtype: 'container',
                        items: [
                            {
                                xtype: 'container'
                            }
                        ]
                    }
                }
            };

            vm = glu.model({
                ns: 'testNs',
                mtype: 'tester'
            });


        });
        ShouldHave('called: beforeCreate, afterCreate, and beforeCollect ', function () {
//            Set up spy for Container Adapter
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