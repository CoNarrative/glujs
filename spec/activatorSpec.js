describe('activator tests', function () {
    //composititon
    describe('given an activator', function () {
        var vm, view;
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    screen:{
                        isHappy:true,
                        mayClose:true,
                        close:function () {
                            if (this.get('mayClose')) {
                                this.parentList.remove(this);
                            }
                        }
                    },
                    tester:{
                        screens:{
                            mtype:'activatorlist',
                            items:[
                                {mtype:'screen'}
                            ],
                            focusProperty:'activeScreen'
                        },
                        activeScreen:0
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'tester'
            });
            vm.init();

        });
        it('there should be a pre-instantiated submodel', function () {
            expect(vm.screens.length).toEqual(1);
        });
        it('the parent of the list should be the viewmodel ', function () {
            expect(vm.screens.parentVM).toEqual(vm);
        });
        it('the root model should be the viewmodel ', function () {
            expect(vm.screens.rootVM).toEqual(vm);
        });
        it('the sub model should have been instantiated', function () {
            expect(vm.screens.getAt(0).get('isHappy')).toEqual(true);
        });
        describe('when the first one is closed', function () {
            beforeEach(function () {
                vm.screens.getAt(0).close();
            });
            it('should be removed', function () {
                expect(vm.screens.length).toEqual(0);
            });
        });
        describe('after setting the viewmodel so close() will reject closing', function () {
            beforeEach(function () {
                vm.screens.getAt(0).set('mayClose', false);
            });
            describe('when the first one is removed', function () {
                beforeEach(function () {
                    vm.screens.getAt(0).close();
                });
                it('should be have been rejected and NOT removed', function () {
                    expect(vm.screens.length).toEqual(1);
                });
            });
        });
        describe('when after adding a new screen and setting it to focus',function(){
            beforeEach(function(){
                var newScreen = glu.model({mtype:'testNs.screen'});
                vm.screens.add(newScreen);
                vm.screens.setActiveItem(newScreen);
            });
            describe('when we delete that new screen at the end',function(){
                beforeEach(function(){
                    vm.screens.removeAt(1);
                })
                it('should have made the original screen have the focus', function(){
                    expect (vm.screens.getActiveIndex()).toBe(0);
                })
            });
            describe('when adding another screen to the end',function(){
                var newScreen;
                beforeEach(function(){
                    newScreen = glu.model({mtype:'testNs.screen'});
                    vm.screens.add(newScreen);
                });
                describe('when we delete the middle screen',function(){
                    beforeEach(function(){
                        vm.screens.removeAt(1);
                    })
                    it('should have made the end screen the new focus screen', function(){
                        expect (vm.screens.getActiveItem()).toBe(newScreen);
                    })
                });
            })
        })

    });
});
