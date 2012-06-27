describe('Localization Specs', function () {
    describe('given a control with localized text syntax', function () {
        var vm, view, itemId;
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                locale:{
                    tester:{
                        start:'Commencez'
                    }
                },
                viewmodels:{
                    tester:{
                        itemDisabled:false
                    }
                },
                views:{
                    tester:{
                        items:[
                            {
                                id:itemId,
                                xtype:'displayfield',
                                text:'~~start~~'
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

        it('the item text should be localized', function () {
            expect(Ext.getCmp(itemId).text).toEqual('Commencez');
        });
    });

    describe('given a control with localized text syntax with substitutions', function () {
        var vm, view, itemId;
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                locale:{
                    tester:{
                        guess:'guess a number between {low} and {high}'
                    }
                },
                viewmodels:{
                    tester:{
                        low : 1,
                        high : 10
                    }
                },
                views:{
                    tester:{
                        items:[
                            {
                                id:itemId,
                                xtype:'displayfield',
                                text:'~~guess~~'
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

        it('the item text should be localized', function () {
            expect(Ext.getCmp(itemId).text).toEqual('guess a number between 1 and 10');
        });
    });

    describe('given a items-generated control with localized text syntax', function () {
        var vm, view, itemId;
        beforeEach(function () {
            itemId = Ext.id();
            testNs = {
                locale:{
                    flavor:{
                        vanilla:'Vanila'
                    }
                },
                viewmodels:{
                    tester:{
                        flavors:{
                            mtype:'jsonstore',
                            recType:'flavor', //used as the locale lookup key - the default local convention
                            fields:['name', 'smackLevel'],
                            data:[
                                {name:'vanilla', smackLevel:'high'}
                            ]
                        }
                    }
                },
                views:{
                    tester:{
                        tbar:[
                            {
                                xtype:'buttongroup',
                                id:itemId,
                                items:'@{flavors}',
                                itemTemplate:function (item) {
                                    return {
                                        xtype:'button',
                                        text:'~~' + item.get('name') + '~~'
                                    };
                                }

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

        it('the item text should start out localized', function () {
            expect(Ext.getCmp(itemId).items.get(0).text).toEqual('Vanila');
        });

    });
});


