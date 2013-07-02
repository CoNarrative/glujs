describe('Adatpers: Container', function () {
    Given('a view with container with a list of viewmodels bound to the items property', function () {
        var view, vm, itemId, screen1, screen2;
        itemId = Ext.id()
        Meaning(function () {
            testNs1 = {
                models: {

                },
                viewmodels: {
                    main: {
                        init: function () {
                            screen1 = this.model({mtype: 'screen1'});
                            this.screens.add(screen1);

                            screen2 = this.model({mtype: 'screen2'});
                            this.screens.add(screen2);
                        },
                        screens: {
                            mtype: 'activatorlist',
                            autoParent: true,
                            focusProperty: 'activeScreen'
                        },
                        setScreen2Active: function () {
                            this.screens.setActiveItem(screen2);
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
                        id: itemId,
                        xtype: 'container',
                        layout: {
                            type: 'card'
                        },
                        items: '@{screens}',
                        activeItem: '@{activeScreen}'
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
            var views = _.chain(view.items.items)
                .filter(function (item) {
                    return glu.isObject(item._vm)
                });

            expect(views.value().length).toEqual(2);

        });
        ShouldHave('have an ActiveItem set to Screen1', function () {
            var activeItem = view.getActiveItem();
            var activeViewModel = activeItem._vm.viewmodelName;
            expect(activeViewModel).toEqual('screen1')
        });
        Given('the screen is changed to Screen 2', function () {
            Meaning(function () {
                vm.setScreen2Active();
            });
            ShouldHave("have an ActiveItem set to Screen2", function () {
                var activeItem = view.getActiveItem();
                var activeViewModel = activeItem._vm.viewmodelName;
                expect(activeViewModel).toEqual('screen2')
            })
        })
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

            spyOn(adapter, 'beforeCollect');
            spyOn(adapter, 'beforeCreate');
            spyOn(adapter, 'afterCreate');


            view = glu.view(vm);

            expect(adapter.beforeCollect).toHaveBeenCalled();
            expect(adapter.beforeCreate).toHaveBeenCalled();
            expect(adapter.afterCreate).toHaveBeenCalled();
        })
    });
    Given('a viewmodel that contains fields', function () {
        var view, vm, itemId;
        Meaning(function () {
            testNs = {
                models: {

                },
                viewmodels: {
                    tester: {
                        fields: ['id', 'prop1', 'prop2',{name:'prop3',type:'string',defaultValue:'threeprop'}],
                        id: '1234',
                        prop1: 'oneProp'
                    }
                }
            };

            vm = glu.model({
                ns: 'testNs',
                mtype: 'tester'
            });


        });
        ShouldHave('two properties set to thier initial values and one blank', function () {
            expect(vm.id).toEqual('1234');
            expect(vm.prop1).toEqual('oneProp');
            expect(vm.prop2).toBeFalsy();
            expect(vm.prop3).toEqual('threeprop');


        })
    });
});