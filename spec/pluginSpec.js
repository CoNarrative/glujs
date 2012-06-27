describe('given an arbitrary plugin', function () {
    var plugin, vm, view, itemId;
    beforeEach(function () {
        plugin = jasmine.createSpy('glu plugin');
        glu.on('foo', plugin);
    });
    describe('when the event is fired', function () {
        beforeEach(function () {
            glu.fireEvent('foo', 17)
        });
        it('the plugin should be notified', function () {
            expect(plugin).toHaveBeenCalledWith(17);
        });
    });
});


describe('given a plugin bound to the beforecollection event', function () {
    var plugin, vm, view, itemId;
    beforeEach(function () {
        plugin = jasmine.createSpy('glu plugin');
        glu.on('beforecollect', plugin);

        itemId = Ext.id();
        testNs = {
            viewmodels:{
                portal:{}
            },
            views:{
                portal:{
                    items:[
                        {
                            id:itemId,
                            xtype:'combo'
                        }
                    ]
                }
            }
        }

    });
    describe('when a view component is instantiated', function () {
        beforeEach(function () {
            vm = glu.model({
                ns:'testNs',
                mtype:'portal'
            });
            view = glu.view(vm, 'testNs', 'portal');
        });
        it('the plugin should be notified with the item config', function () {
            //last call should
            expect(plugin.argsForCall[plugin.argsForCall.length - 1][0].id).toEqual(testNs.views.portal.items[0].id);
        });
    });
});
