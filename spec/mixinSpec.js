describe('given a view model with a mixin', function () {
    var vm, view, itemId, init;
    beforeEach(function () {
        itemId = Ext.id();
        init = jasmine.createSpy();
        testNs = {
            viewmodels:{
                gogetter:{
                    initMixin:init,
                    go:jasmine.createSpy()
                },
                tester:{
                    mixins:['gogetter']
                }
            },
            views:{
                tester:{
                    tbar:[
                        {
                            id:itemId,
                            name:'go'
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
    it('should have initialized mixin', function () {
        expect(init).toHaveBeenCalled();
    });
    describe('when a user clicks the button', function () {
        beforeEach(function () {
            exthelper.click(itemId);
        });
        it('The corresponding action should fire', function () {
            expect(vm.go).toHaveBeenCalled();
        });
    });
});
describe('given a view model with a mixin that is itself a factory', function () {
    var vm, view, itemId;
    beforeEach(function () {
        itemId = Ext.id();
        testNs = {
            viewmodels:{
                gogetterFactory:function () {
                    return {go:jasmine.createSpy()};
                },
                tester:{
                    mixins:['gogetter']
                }
            },
            views:{
                tester:{
                    tbar:[
                        {
                            id:itemId,
                            name:'go'
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
    describe('when a user clicks the button', function () {
        beforeEach(function () {
            exthelper.click(itemId);
        });
        it('The corresponding action should fire', function () {
            expect(vm.go).toHaveBeenCalled();
        });
    });
});
describe('given a view model with a global mixin', function () {
    var vm, view, itemId, init;
    beforeEach(function () {
        init = jasmine.createSpy();
        glu.mreg('woohoo',
            {
                initMixin:init,
                go:jasmine.createSpy()
            });
        testNs = {
            viewmodels:{
                tester:{
                    mixins:['woohoo']
                }
            }
        };
        vm = glu.model({
            ns:'testNs',
            mtype:'tester'
        });
    });
    it('should have initialized mixin', function () {
        expect(init).toHaveBeenCalled();
    });
});
