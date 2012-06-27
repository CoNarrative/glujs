xdescribe('given a config transformer that adds a marker', function () {
    var vm, view, itemId, transformer;
    beforeEach(function () {
        var transformer =
            glu.regAdapter('testtransformer', {
                beforeCollect:function (config) {
                    config.marker = true;
                }
            });
    });
    describe('given a panel with that transformer', function () {
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    portal:{
                    }
                },
                views:{
                    portal:{
                        items:[
                            {
                                id:itemId,
                                mixins:['testtransformer']
                            }
                        ]
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'portal'
            });
            view = glu.view(vm, 'testNs', 'portal');
        });
        it('the field should now have been marked with the transformation', function () {
            expect(view.items.get(0).marker).toEqual(true);
        });
    });
});
describe('given a config transformer that manipulates it\'s children in the beforeCreate (after initial binding)', function () {
    var vm, view, itemId, transformer;
    beforeEach(function () {
        var transformer =
            glu.regAdapter('transformChildNode', {
                //transforms all individual item to the global status
                //this will happen twice
                //1) will set it to 'BAD'
                //2) will ignore it because already set to '@{..errorCode}'
                beforeCollect:function (config) {
                    if (config.fieldLabel === undefined) {
                        config.fieldLabel = '@{..status}';
                    }
                }
            });
        glu.regAdapter('transformContainer', {
            //transforms all child BAD statuses into error codes
            beforeCreate:function (config) {
                for (var i = 0; i < config.items.length; i++) {
                    var item = config.items[i];
                    if (item.fieldLabel == 'BAD') {
                        item.fieldLabel = '@{..errorCode}';
                    }
                }
                return {rebindChildren:true};
            }
        });
    });
    describe('given a panel with that transformer', function () {
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                viewmodels:{
                    portal:{
                        errorCode:'404',
                        status:'BAD'
                    }
                },
                views:{
                    portal:{
                        transforms:['transformContainer'],
                        items:[
                            {
                                id:itemId,
                                transforms:['transformChildNode']
                            }
                        ]
                    }
                }
            };
            vm = glu.model({
                ns:'testNs',
                mtype:'portal'
            });
            view = glu.view(vm, 'testNs', 'portal');
        });
        it('the children should have passed through second-stage binding', function () {
            expect(view.items.get(0).fieldLabel).toEqual('404');
        });
    });
});