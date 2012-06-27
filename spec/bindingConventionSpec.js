describe('Binding Conventions', function () {
    describe('given the binding syntax of @{slices}', function () {
        var binder;
        beforeEach(function () {
            binder = glu.parseBindingSyntax('@{slices}');
        });
        it('oneway binding should be established', function () {
            expect(binder.oneway).toEqual(true);
        });
        it('the bind expression should be \'slices\'', function () {
            expect(binder.bindExpression).toEqual('slices');
        });
    });

    describe('given the one-time binding syntax of @1{slices}', function () {
        var binder;
        beforeEach(function () {
            binder = glu.parseBindingSyntax('@1{slices}');
        });
        it('one time binding should be established', function () {
            expect(binder.onetime).toEqual(true);
        });
        it('the bind expression should be \'slices\'', function () {
            expect(binder.bindExpression).toEqual('slices');
        });
    });

    describe('given the optional binding syntax of @?{slices}', function () {
        var binder;
        beforeEach(function () {
            binder = glu.parseBindingSyntax('@?{slices}');
        });
        it('optional binding should be established', function () {
            expect(binder.optional).toEqual(true);
        });
        it('the bind expression should be \'slices\'', function () {
            expect(binder.bindExpression).toEqual('slices');
        });
    });

    describe('given a text value that could be mistaken for a binding', function () {
        var view;
        var originalText = 'mikester@foo.com {the one and only}';
        beforeEach(function () {
            testns = {
                viewmodels:{
                    tester:{

                    }
                },
                views:{
                    tester:{
                        xtype:'panel',
                        items:[
                            {
                                xtype:'displayfield',
                                value:originalText
                            }
                        ]
                    }
                }
            };
            view = glu.createViewmodelAndView({ns:'testns', mtype:'tester'});
        });
        it('no binding should have been established', function () {
            expect(view.items.get(0).getValue()).toEqual(originalText);
        });

    });
    describe('given an optional bind without an actual backing field', function () {
        var view;
        beforeEach(function () {
            testns = {
                viewmodels:{
                    tester:{
                    }
                },
                views:{
                    tester:{
                        xtype:'panel',
                        items:[
                            {
                                xtype:'displayfield',
                                foo:'@?{!isEnabled}'
                            }
                        ]
                    }
                }
            };
            view = glu.createViewmodelAndView({ns:'testns', mtype:'tester'});
        });
        it('no binding should have been established', function () {
            expect(view.items.get(0).foo).toBeUndefined();
        });

    });
    describe('given an optional bind with an actual backing field', function () {
        var view;
        beforeEach(function () {
            testns = {
                viewmodels:{
                    tester:{
                        isEnabled:false
                    }
                },
                views:{
                    tester:{
                        xtype:'panel',
                        items:[
                            {
                                xtype:'displayfield',
                                foo:'@?{!isEnabled}'
                            }
                        ]
                    }
                }
            };
            view = glu.createViewmodelAndView({ns:'testns', mtype:'tester'});
        });
        it('no binding should have been established', function () {
            expect(view.items.get(0).foo).toBe(true);
        });

    });
    describe('given a normal (required) bind with an actual backing field', function () {
        var view;
        beforeEach(function () {
            testns = {
                viewmodels:{
                    tester:{
                    }
                },
                views:{
                    tester:{
                        xtype:'panel',
                        items:[
                            {
                                xtype:'displayfield',
                                foo:'@{!isEnabled}'
                            }
                        ]
                    }
                }
            }
        });
        it('should throw an exception', function () {
            expect(
                function () {
                    glu.open({ns:'testns', mtype:'tester'})
                }).toThrow();

        });

    });

});