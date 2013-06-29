describe('Adatpers: Container', function () {
    Given('a view with container that contains items (more containers)', function () {
        var view, vm, itemId;
        Meaning(function () {
            testNs = {
                models: {

                },
                viewmodels: {
                    main: {
                        init: function () {
                            var screen1 = this.model({mtype: 'screen1'});
                            this.screens.add(screen1);
                            this.set('activeScreen', screen1);

                        },
                        screens: {
                            mtype: 'activatorlist',
                            autoParent: true,
                            focusProperty: 'activeScreen'
                        },
                        screenActive: {mtype: 'screen1'},
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
                        xtype: 'container',
                        layout: {
                            type: 'card'
                        },
                        items: '@{screens}'
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
                ns: 'testNs',
                mtype: 'main'
            });
//            view = glu.view(vm, 'testNs', 'main');

        });
        ShouldHave('called: Adapter - setComponentProperty', function () {

            //Set up spy for Container Adapter
            var adapter = glu.provider.adapters['container'];
            view = glu.view(vm);

            var activeItem = view.getActiveItem();

            expect(glu.isObject(activeItem)).toBeTruthy();

        })
    });
    Given('a view with container that contains has a list of viewmodels bound to the items property', function () {
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
            //Set up spy for Container Adapter
//            var adapter = glu.provider.adapters['container'];
//
//            spyOn(adapter,'beforeCollect');
//            spyOn(adapter,'beforeCreate');
//            spyOn(adapter,'afterCreate');
//
//
//            view = glu.view(vm);
//
//            expect(adapter.beforeCollect).toHaveBeenCalled();
//            expect(adapter.beforeCreate).toHaveBeenCalled();
//            expect(adapter.afterCreate).toHaveBeenCalled();
        })
    });
});