describe("entry point specifications", function () {
    describe('given a panel defined as a glu entry point', function () {
        var itemId= Ext.id(), registrationParameterId = Ext.id(), containerParameterId = Ext.id();
        entrypointTestNs = {
            viewmodels:{
                tester:{
                    name:'doodle',
                    registrationParameter:0,
                    containerParameter:''
                }
            },
            views:{
                tester:{
                    title:'Tester8',
                    items:[
                        {
                            itemId:itemId,
                            xtype:'displayfield',
                            value:'@{name}'
                        },
                        {
                            itemId:registrationParameterId,
                            xtype:'displayfield',
                            value:'@{registrationParameter}'
                        },
                        {
                            itemId:containerParameterId,
                            xtype:'displayfield',
                            value:'@{containerParameter}'
                        }
                    ]

                }
            }
        }
        glu.panel('entrypointTestNstestPanel', {
            ns:'entrypointTestNs',
            mtype:'tester',
            registrationParameter:27
        });
        describe('when registered explicitly and then added to a non-glu container', function () {
            var gluPanel, nongluApp;
            beforeEach(function () {
                if (Ext.getVersion().major>'3') {
                    Ext.ComponentManager.all.clear();
                }
                gluPanel = glu.widget({
                    xtype:'entrypointTestNstestPanel',
                    width:99,
                    viewmodelConfig:{
                        containerParameter:'chocolate'
                    }
                });
                nongluApp = new Ext.Panel({
                    items:[gluPanel]
                });
            });
            it('the glu panel should have glu components read', function () {
                expect(gluPanel.getComponent(itemId).getValue()).toBe('doodle');
            })
            it('the registration parameter should have been accepted', function () {
                //Ext 4.x converts non-core parameters to strings
                expect(String(gluPanel.getComponent(registrationParameterId).getValue())).toBe('27');
            });
            it('should have container-specific parameters', function () {
                expect(gluPanel.getComponent(containerParameterId).getValue()).toBe('chocolate');
            });
            it('should have respected a container-specific view property override like the width', function () {
                expect(gluPanel.width).toBe(99);
            });
            it('parameters defined in the view should be at the gluPanel level, not nested inside a wrapper panel', function () {
                expect(gluPanel.title).toBe('Tester8');
            });
        });
        describe('when added to a non-glu container using pre-registered glupanel', function () {
            var gluPanel, nongluApp;
            beforeEach(function () {
                gluPanel = glu.widget({
                    xtype:'glupanel',
                    width:99,
                    viewmodelConfig:{
                        ns:'entrypointTestNs',
                        mtype:'tester',
                        containerParameter:'chocolate'
                    }
                });
                nongluApp = new Ext.Panel({
                    items:[gluPanel]
                });
            });
            it('the glu panel should have glu components read', function () {
                expect(gluPanel.getComponent(itemId).getValue()).toBe('doodle');
            });
            it('the rootVM should be itself', function () {
                expect(gluPanel.vm.rootVM).toBe(gluPanel.vm);
            })
            it('should have container-specific parameters', function () {
                expect(gluPanel.getComponent(containerParameterId).getValue()).toBe('chocolate');
            });
            it('should have respected a container-specific view property override like the width', function () {
                expect(gluPanel.width).toBe(99);
            });
            it('parameters defined in the view should be at the gluPanel level, not nested inside a wrapper panel', function () {
                expect(gluPanel.title).toBe('Tester8');
            });
        });
    })
});