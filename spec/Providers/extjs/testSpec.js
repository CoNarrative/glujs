describe('Test library spec', function () {
    var backend;
    beforeEach(function () {
        backend = glu.test.createBackend({
            defaultRoot:'/json/',
            routes:[
                {
                    name:'merchant_locations',
                    url:'merchant/:id/locations',
                    handle:function (request) {
                        return {
                            responseText:request.params.id
                        };
                    }
                },
                {
                    name:'locations',
                    url:'location/:id'
                }
            ]
        });
        backend.capture();
    });
    describe('When making an request with a query string', function () {
        var success;
        beforeEach(function () {
            success = jasmine.createSpy();
            Ext.Ajax.request({
                url:'merchant/17/locations?foo=bar',
                success:success
            });
        });
        describe('And responding with a supplied response', function () {
            beforeEach(function () {
                backend.respondTo('merchant_locations', {
                    responseText:'foo'
                });
            });
            it('Should have used the supplied response', function () {
                expect(success.mostRecentCall.args[0].responseText).toBe('foo');
            });
        });
    });
    describe('Given a store with a proxy', function () {

        if (Ext.getVersion().major > 3) {
            Ext.define('test.ajax.Foo', {
                extend:'Ext.data.Model',
                fields:['id']
            });
            var store = new Ext.data.Store({
                model:'test.ajax.Foo',
                proxy:{
                    url:'merchant/17/locations?foo=bar',
                    type:'ajax',
                    method:'POST',
                    reader:{
                        type:'json',
                        root:'dtos',
                        totalProperty:'recordCount'
                    }
                }
            })
        } else {
            var store = new Ext.data.JsonStore({
                url:'merchant/17/locations?foo=bar',
                fields :[],
                root : 'dtos',
                totalProperty:'recordCount'
            });
        }

        describe('When making a request through store.load', function () {
            var success;
            beforeEach(function () {
                store.load();
            });
            describe('And responding with a supplied response with a total record count of 7', function () {
                beforeEach(function () {
                    backend.respondTo('merchant_locations', {
                        responseText:'{dtos:[],recordCount:7}'
                    });
                });
                it('Should have used the supplied response so that the count is 7 ', function () {
                    expect(store.getTotalCount()).toBe(7);
                });
            });
        });
    });
    describe('When making an request', function () {
        var success;
        beforeEach(function () {
            success = jasmine.createSpy();
            Ext.Ajax.request({
                url:'merchant/17/locations',
                success:success
            });
        });
        describe('And responding with a supplied response', function () {
            beforeEach(function () {
                backend.respondTo('merchant_locations', {
                    responseText:'foo'
                });
            });
            it('Should have used the supplied response', function () {
                expect(success.mostRecentCall.args[0].responseText).toBe('foo');
            });
        });
        describe('And responding with an automated response', function () {
            beforeEach(function () {
                backend.respondTo('merchant_locations');
            });
            it('Should have used the automated response', function () {
                expect(success.mostRecentCall.args[0].responseText).toBe('17');
            });
        });
        describe('When making a subsequent request', function () {
            var locationSuccess;
            beforeEach(function () {
                locationSuccess = jasmine.createSpy();
                Ext.Ajax.request({
                    url:'location/23',
                    success:locationSuccess
                });
            });
            describe('can return out of order', function () {
                beforeEach(function () {
                    backend.respondTo('locations', {
                        responseText:'bar'
                    });
                    backend.respondTo('merchant_locations', {
                        responseText:'foo'
                    });
                });
                it('Should have used the supplied response for the first request', function () {
                    expect(success.mostRecentCall.args[0].responseText).toBe('foo');
                });
                it('Should have used the supplied response for the second request', function () {
                    expect(locationSuccess.mostRecentCall.args[0].responseText).toBe('bar');
                });
            });
        })
    });
    describe('Given a test database', function () {
        var table;
        beforeEach(function () {
            table = glu.test.createTable([
                {
                    name:'id',
                    type:'int'
                },
                {
                    name:'desc',
                    type:'string'
                }
            ], [
                {id:1, desc:'foo'},
                {id:2, desc:'bar'}
            ])
        });
        it('Should have created initial 2 records', function () {
            expect(table.list().rows.length).toBe(2);
        });
        it('Should have returned first record first in list', function () {
            expect(table.list().rows[0].desc).toBe('foo');
        });
        it('Should return 1 item when limit is 1', function () {
            expect(table.list({limit:1}).rows.length).toBe(1);
        });
        it('Should return only remaining items when limit is more than max available', function () {
            expect(table.list({start:1, limit:10}).rows.length).toBe(1);
        })
    });

});
