describe('given a view model with a mixin', function () {
    var vm, view, itemId;
    beforeEach(function () {
        itemId = Ext.id();
        testNs = {
            viewmodels:{
                gogetter:{
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