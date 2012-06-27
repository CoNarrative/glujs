/*
 *  Copyright (C) 2012 by CoNarrative
 */
/**
 *
 * @class glu.test
 *
 */
/**
 * Creates a table given a fields definition and an array of initial data
 * @param fields
 * @param data
 * @return {glu.test.MemoryTable}
 */
glu.test.createTable = function (fields, data) {
    if (fields.fields) {
        fields = fields.fields;
    }
    if (glu.isNumber(data) || data === undefined) {
        data = glu.test.createFakeData(fields, data || 50);
    }
    var keyIndex = {};
    for (var i = 0 ;i<data.length;i++){
        var row = data[i];
        keyIndex[row.id] = row;
    }
/**
 * @class glu.test.MemoryTable
 * An in-memory table for use with glu.test.ajax
 */
    var me = {
    /**
     * Gets a stored object by id
     * @param {String} id
     * @return {Object}
     */
    get:function (id) {
            return keyIndex[id];
        },
    /**
     * Iterates over items in the table
     * @param {String} id
     * @param {Function} op
     */
        each : function(id, op) {
            var ids = Ext.isArray(id) ? id : [id];
            for (var i =0;i<ids.length;i++){
                var thisId = ids[i];
                op(thisId);
            }
        },
    /**
     * Updates one or more rows, replacing *only* the provided fields
     * @param {String/Array} ids An id or array of ids
     * @param {Object} newData The field values to be overwritten
     * @return {Object}
     */
        update : function (ids, newData) {
            me.each (ids, function(id){
                glu.apply(keyIndex[id], newData);
            });
            return {};
        },
    /**
     * Creates a new row
     * @param {Object} newData The new row
     */
        create : function (newData) {
            var id = newData.id;
            if (id === undefined) throw "An id property is required";
            if (keyIndex[id]) throw "Duplicate key of " + id;
            data.push(newData);
            keyIndex[id] = newData;
        },
    /**
     * Replaces an existing row in its entirey. Unlike update, all fields will be overwritten
     * @param {String/Array} ids An id or array of ids
     * @param {Object} newData The new row
     * @return {Object}
     */
        replace : function (ids, newData){
            me.each (ids, function(id){
                keyIndex[id] = newData;
                newData.id = id;
                for (var i=0; i<data.length; i++){
                    if (data[i].id==id) {
                        data[i]=newData;
                        break;
                    }
                }
            });
            return {};
        },
    /**
     * Removes one or more rows
     * @param ids The ids of the rows to remove
     * @return {Object}
     */
        remove : function (ids) {
            me.each (ids, function(id){
                for (var i=0; i<data.length; i++){
                    if (data[i].id==id) {
                        data.splice(i,1);
                        break;
                    }
                }
                delete keyIndex[id];
            });
            return {};
        },
    /**
     * Return a list of rows as an array
     * @param query The query expressed as an object with a number of named parameters
     * @param filterFn An optional filter function
     * @return {Object}
     *
     * The query named parameters are:
     *
     *   - `start` The index at which to start
     *   - `limit` Number of rows to return
     *   - `sorters` An array of sorters on which to sort
     *   - `filters` An array of filters
     */
        list:function (query, filterFn) {
            query = query || {};

            data = glu.deepApply(data);

            var params = query.params || query;
            params.start = query.start || 0;
            //will fake like a remote database
            var config = {
                reader:new Ext.data.JsonReader({
                    fields:fields
                }),
                data:data
            };
            if (Ext.getVersion().major > 3 || Ext.getProvider().provider == 'touch') {
                var cfg = config;
                //inline a model as needed
                if (cfg.fields || (cfg.reader && cfg.reader.fields)) {
                    //just build a dynamic model...
                    //TODO: Make a 'fields' cache that can create models dynamically based on a set of fields
                    //so at least they are cached
                    var name = 'glu.test.models' + Ext.id().replace('-', '_');
                    Ext.define(name, {
                        extend:'Ext.data.Model',
                        fields:cfg.fields || cfg.reader.fields
                    });
                    cfg.model = name;
                }
            }

            if (Ext.getVersion().major > 3 || Ext.getProvider().provider == 'touch') {
                if (params.sorters) {
                    config.sorters = params.sorters
                }
                if (params.sort) {
                    config.sorters = Ext.decode(params.sort);
                }
            }
            else{
                if (params.sort) {
                    config.sortInfo = {
                        field:params.sort,
                        direction:params.dir
                    }
                }
            }
            var memStore = new Ext.data.Store(config);
            // [{"comparator":"RE","value":"aa"}]
            var filters = params.filters || [];

            if (params.filterText) {
                filters.push({
                    field:'firstName',
                    value:params.filterText
                });
            }

            function checkFilter(record, fieldFilter) {
                //starts with...
                var testVal = record.get(fieldFilter.field);
                var value = fieldFilter.value;
                if (Ext.isString(testVal)) {
                    return testVal.indexOf(value) == 0;
                }
                return false;
            }

            function filterBy(record) {
                for (var i = 0; i < filters.length; i++) {
                    var include = checkFilter(record, filters[i]);
                    if (!include) {
                        return false;
                    }
                }
                return true;
            }

            if(filterFn){
                memStore.filterBy(filterFn)
            }
            else if (filters.length > 0) {
                memStore.filterBy(filterBy);
            }


            var records = memStore.getRange();
            var pagedRecords = [];

            //do paging...
            var operation = params;
            var remaining = records.length - operation.start;
            operation.limit = Ext.isDefined(operation.limit) ? operation.limit : remaining;
            var take = operation.limit < remaining ? operation.limit : remaining;
            for (var i = operation.start; i < operation.start + take; i++) {
                pagedRecords.push(records[i].data);
            }

            //return as a paged result
            return {
                total:records.length,
                rows:pagedRecords
            };
        }
    };
    return me;
};

glu.test.types = {
    'string':function (field) {
        //remember to include code/lookup data (only good if using foreign 'lookup' keys on data :-) )
        var name = field.name.toLowerCase();
        var value = '';
        if (name.indexOf('firstname') > -1) {
            value = glu.fake.contact.firstName();
            return value;
        }
        if (name.indexOf('lastname') > -1) {
            value = glu.fake.contact.lastName();
            return value;
        }
        if (name.indexOf('name') > -1) {
            value = glu.fake.contact.name();
            return value;
        }
        if (name.indexOf('fax') > -1 || name.indexOf('phone') > -1 || name.indexOf('mobile') > -1) {
            value = glu.fake.contact.phoneNumber();
            return value;
        }
        if (name.indexOf('dob') > -1 || name.indexOf('date') > -1) {
            value = glu.fake.date({min:"1/1/1960", max:"1/1/1972", separator:"/"});
            return value;
        }
        if (name == 'state') {
            return glu.fake.contact.state;
        }
        if (name.indexOf('postal') == 0 || name.indexOf('zip') == 0) {
            return glu.fake.contact.zip(5);
        }
        if (name.indexOf('memo') > -1 || name.indexOf('description') > -1) {
            return glu.fake.words(8, 12);
        }
        return glu.fake.title(4, 5);
    },
    'int':function (field) {
        if(field.max){
            return Math.floor(Math.random()*field.max);
        }
        return glu.fake.bigNumber(4);
    },
    'boolean':function (field) {
        return glu.fake.bool();
    },
    'date':function (field) {
        return glu.fake.date({min:"1/1/1960", max:"1/1/1972", delimiter:"/"});
    },
    'float':function (field) {
        if(field.max){
            return Math.floor(Math.random()*field.max);
        }
        return glu.fake.bigNumber(7);
    }
};
glu.test.types.number = glu.test.types['float'];
glu.test.types.integer = glu.test.types['int'];
glu.test.types.bool = glu.test.types['boolean'];

glu.test.createFakeData = function (fields, number) {
    var data = [];
    var id = 0;

    for (var i = 0; i < number; i++) {
        var row = {};
        data.push(row);
        for (var f = 0; f < fields.length; f++) {
            var field = fields[f];
            var name = field.name;
            var type = field.type;
            if (field.name == 'id') {
                id = id + 1;
                row[name] = id;
                continue;
            }
            if (field.oneOf){
                if(glu.isNumber(field.oneOf)){
                    row[name] = Math.floor(Math.random()*field.oneOf);
                }
                else{
                    // an array is given
                    row[name] = glu.fake.oneOf(field.oneOf);
                }
                continue;
            }
            row[name] = glu.test.types[type](field, row);
        }
    }

    return data;
};
