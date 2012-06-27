describe('Item Binding Spec', function () {
    var compositeType = Ext.getVersion().major > 3 ? 'fieldcontainer' : compositeType;
    describe('given a container with an itemTemplate bound to an array', function () {
        // go through all of our glu interfaces and make sure that the ExtJs 3.4.0 provider implements them
        var vm, view, itemId, itemIds = [];
        beforeEach(function () {
            itemIds.push(Ext.id());
            itemIds.push(Ext.id());
            var itemCount = 0;
            testNs = {
                viewmodels:{
                    tester:{
                        flavors:[
                            {
                                name:'chocolate'
                            },
                            {
                                name:'vanilla'
                            }
                        ]
                    }
                },
                views:{
                    tester:{
                        items:'@{flavors}',
                        itemTemplate:function (item) {
                            return {
                                xtype:'button',
                                itemId:itemIds[itemCount++],
                                text:item.name
                            };
                        }
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            view = glu.view(vm, 'testNs', 'tester');
        });
        it('the original view should have two corresponding buttons rendered by the itemTemplate', function () {
            expect(view.getComponent(itemIds[0]).text).toEqual('chocolate');
            expect(view.getComponent(itemIds[1]).text).toEqual('vanilla');
        });
    });
    describe('given a container with an itemTemplate bound to a single integer value (meaning treat as enumeration)', function () {
        // go through all of our glu interfaces and make sure that the ExtJs 3.4.0 provider implements them
        var vm, view, itemId, itemIds = [];
        beforeEach(function () {
            itemIds.push(Ext.id());
            itemIds.push(Ext.id());
            itemIds.push(Ext.id());
            var itemCount = 0;
            testNs = {
                viewmodels:{
                    tester:{
                        flavors:2
                    }
                },
                views:{
                    tester:{
                        items:'@{flavors}',
                        itemTemplate:function (item) {
                            return {
                                xtype:'button',
                                id:itemIds[itemCount++],
                                text:String(item)
                            };
                        }
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            view = glu.view(vm, 'testNs', 'tester');
        });
        it('the original view should have two corresponding buttons rendered by the itemTemplate', function () {
            expect(view.getComponent(itemIds[0]).text).toEqual('0');
            expect(view.getComponent(itemIds[1]).text).toEqual('1');
            expect(view.getComponent(itemIds[2]).text).toEqual('2');
        });
    });
    describe('given a compositefield with an itemTemplate bound to a single integer value (meaning treat as enumeration)', function () {
        // go through all of our glu interfaces and make sure that the ExtJs 3.4.0 provider implements them
        var vm, view, itemId, itemIds = [];
        beforeEach(function () {
            itemIds.push(Ext.id());
            itemIds.push(Ext.id());
            itemIds.push(Ext.id());
            var itemCount = 0;
            testNs = {
                viewmodels:{
                    tester:{
                        flavors:2
                    }
                },
                views:{
                    tester:{
                        fieldLabel:'flavors',
                        xtype:compositeType,
                        items:'@{flavors}',
                        itemTemplate:function (item) {
                            return {
                                xtype:'button',
                                itemId:itemIds[itemCount++],
                                text:String(item)
                            };
                        }
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            view = glu.view(vm, 'testNs', 'tester');
        });
        it('the original view should have two corresponding buttons rendered by the itemTemplate', function () {
            expect(view.getComponent(itemIds[0]).text).toEqual('0');
            expect(view.getComponent(itemIds[1]).text).toEqual('1');
            expect(view.getComponent(itemIds[2]).text).toEqual('2');
        });
    });
    describe('given a compositefield with an itemTemplate bound to a store', function () {
        // go through all of our glu interfaces and make sure that the ExtJs 3.4.0 provider implements them
        var vm, view, itemId, itemIds = [];
        beforeEach(function () {
            itemIds.push(Ext.id());
            itemIds.push(Ext.id());
            itemIds.push(Ext.id());
            var itemCount = 0;
            testNs = {

                viewmodels:{
                    tester:{
                        flavors:{
                            mtype:'jsonstore',
                            fields:[
                                {
                                    name:'name'
                                },
                                {
                                    name:'score',
                                    type:'int'
                                }
                            ]
                        },
                        init:function () {
                            this.flavors.loadData([
                                {
                                    name:'chocolate',
                                    score:5
                                },
                                {
                                    name:'vanilla',
                                    score:10
                                }
                            ]);
                        }
                    }
                },
                views:{
                    tester:{
                        fieldLabel:'flavors',
                        xtype:compositeType,
                        items:'@{flavors}',
                        itemTemplate:function (item) {
                            return {
                                xtype:'button',
                                itemId:itemIds[itemCount++],
                                text:item.get('name')
                            };
                        }
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
        it('the original view should have two corresponding buttons rendered by the itemTemplate', function () {
            expect(view.getComponent(itemIds[0]).text).toEqual('chocolate');
            expect(view.getComponent(itemIds[1]).text).toEqual('vanilla');
        });
        it('in Ext 3.x, the records should not have been made observable', function () {
            if (Ext.getVersion().major > 3) return;
            expect(vm.flavors.getAt(0).on).toEqual(null);
        });
        describe('when a new item is added at the end', function () {
            beforeEach(function () {
                vm.get('flavors').loadData([
                    {
                        name:'strawberry',
                        score:1
                    }
                ], true);
            });
            it('should add corresponding item at the end', function () {
                expect(view.items.get(2).text).toEqual('strawberry');
            })
        });
        describe('when a new item is added in the middle', function () {
            beforeEach(function () {
                var insertAt = 1;
                var ctor = Ext.getVersion().major > 3 ? vm.flavors.model : vm.flavors.recordType;
                var newRec = new ctor({
                    name:'strawberry',
                    score:1
                });
                vm.flavors.insert(insertAt, newRec);
            });
            it('should add corresponding item in the middle', function () {
                expect(view.items.get(1).text).toEqual('strawberry');
            })
        });
    });
    describe('given a compositefield with an itemTemplate bound to a store and values bound using syntax', function () {
        // go through all of our glu interfaces and make sure that the ExtJs 3.4.0 provider implements them
        var vm, view, itemId, itemIds = [];
        beforeEach(function () {
            itemIds.push(Ext.id());
            itemIds.push(Ext.id());
            itemIds.push(Ext.id());
            var itemCount = 0;
            testNs = {

                viewmodels:{
                    tester:{
                        flavors:{
                            mtype:'jsonstore',
                            fields:[
                                {
                                    name:'name'
                                },
                                {
                                    name:'score',
                                    type:'int'
                                }
                            ]
                        },
                        init:function () {
                            this.flavors.loadData([
                                {
                                    name:'chocolate',
                                    score:5
                                },
                                {
                                    name:'vanilla',
                                    score:10
                                }
                            ]);
                        }
                    }
                },
                views:{
                    tester:{
                        fieldLabel:'flavors',
                        xtype:compositeType,
                        items:'@{flavors}',
                        itemTemplate:function (item) {
                            return {
                                xtype:'button',
                                itemId:itemIds[itemCount++],
                                text:'@{name}'
                            };
                        }
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
        it('the original view should have two corresponding buttons rendered by the itemTemplate', function () {
            expect(view.getComponent(itemIds[0]).text).toEqual('chocolate');
            expect(view.getComponent(itemIds[1]).text).toEqual('vanilla');
        });
        describe('when an existing item is modified', function () {
            beforeEach(function () {
                vm.get('flavors').getAt(0).set('name', 'chocolatesupreme', true);
            });
            it('should update corresponding field in bound item', function () {
                expect(view.getComponent(itemIds[0]).text).toEqual('chocolatesupreme');
            })
        });
    });
    describe('given a compositefield with an itemTemplate bound to a glu List and values bound using syntax', function () {
        // go through all of our glu interfaces and make sure that the ExtJs 3.4.0 provider implements them
        var vm, view, itemId, itemIds = [];
        beforeEach(function () {
            itemIds.push(Ext.id());
            itemIds.push(Ext.id());
            itemIds.push(Ext.id());
            var itemCount = 0;
            testNs = {

                viewmodels:{
                    tester:{
                        flavors:{
                            mtype:'list',
                            data:[
                                {
                                    name:'chocolate',
                                    score:5
                                },
                                {
                                    name:'vanilla',
                                    score:10
                                }
                            ]
                        }
                    }
                },
                views:{
                    tester:{
                        fieldLabel:'flavors',
                        xtype:compositeType,
                        items:'@{flavors}',
                        itemTemplate:function (item) {
                            return {
                                xtype:'button',
                                itemId:itemIds[itemCount++],
                                text:'@{name}'
                            };
                        }
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            view = glu.view(vm, 'testNs', 'tester');
        });
        it('the original view should have two corresponding buttons rendered by the itemTemplate', function () {
            expect(view.getComponent(itemIds[0]).text).toEqual('chocolate');
            expect(view.getComponent(itemIds[1]).text).toEqual('vanilla');
        });
        describe('when a new item is added at the end', function () {
            beforeEach(function () {
                vm.get('flavors').add({
                    name:'strawberry',
                    score:1
                });
            });
            it('should add corresponding item at the end', function () {
                expect(view.items.get(2).text).toEqual('strawberry');
            })
        });
        describe('when a new item is added in the middle', function () {
            beforeEach(function () {
                var insertAt = 1;
                vm.flavors.insert(insertAt, {
                    name:'strawberry',
                    score:1
                });
            });
            it('should add corresponding item in the middle', function () {
                expect(view.items.get(1).text).toEqual('strawberry');
            })
        });
    });
    describe('given a toolbar with items bound to a list', function () {
        // go through all of our glu interfaces and make sure that the ExtJs 3.4.0 provider implements them
        var vm, view, itemId, itemIds = [];
        beforeEach(function () {
            itemIds.push(Ext.id());
            itemIds.push(Ext.id());
            itemIds.push(Ext.id());
            var itemCount = 0;
            testNs = {
                locale:{
                    chocolate:'chocolate',
                    vanilla:'vanilla'
                },
                viewmodels:{
                    tester:{
                        flavors:{
                            mtype:'list'
                        },
                        init:function () {
                            this.flavors.add(glu.model({
                                name:'chocolate',
                                score:5
                            }));
                            this.flavors.add(glu.model({
                                name:'vanilla',
                                score:10
                            }));
                        }
                    }
                },
                views:{
                    tester:{
                        tbar:{
                            xtype:'toolbar',
                            items:'@{flavors}',
                            itemTemplate:{
                                xtype:'button',
                                text:'@{name}'
                            }
                        },
                        bbar:'@{flavors}'
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            vm.init();
            view = glu.view(vm, 'testNs', 'tester');
            if (view.getTopToolbar === undefined) {//Ext.getVersion().major>3
                view.getTopToolbar = function () {
                    return this.getDockedComponent(0);
                }; //getting it by 'top' doesn't work in Ext 4.07
                view.getBottomToolbar = function () {
                    return this.getDockedComponent(1);
                }
            }
        });
        it('the view\'s top toolbar (bound explicitly) should have two corresponding buttons rendered by the itemTemplate', function () {
            var tbar = view.getTopToolbar();
            expect(view.getTopToolbar().items.first().text).toEqual('chocolate');
            expect(view.getTopToolbar().items.get(1).text).toEqual('vanilla');
        });
        it('the view\'s bottom toolbar (bound with array shortcut) should have two corresponding buttons rendered by the itemTemplate', function () {
            var tbar = view.getTopToolbar();
            expect(view.getBottomToolbar().items.first().text).toEqual('chocolate');
            expect(view.getBottomToolbar().items.get(1).text).toEqual('vanilla');
        });
        describe('when an existing item is modified', function () {
            beforeEach(function () {
                vm.flavors.getAt(0).set('name', 'chocolatesupreme');
            });
            it('should update corresponding field in bound item', function () {
                expect(view.getTopToolbar().items.first().text).toEqual('chocolatesupreme');
            })
        });
    });
});
