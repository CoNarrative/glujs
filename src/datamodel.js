/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.DataModel = glu.extend(glu.Viewmodel, {
    constructor : function(config) {
        glu.log.debug('BEGIN datamodel construction');
        this._private = this._private || {};
        config.recType = config.recType || config.model || config.modelType;
        if (config.recType) {
            this._private.model = glu.walk(config.ns + '.models.' + config.recType);
        } else {
            if (glu.isArray(config.fields)) {
                for (var i = 0, len = config.fields.length; i < len; i++) {
                    if (glu.isString(config.fields[i])) {
                        config.fields[i] = {
                            name : config.fields[i],
                            type : 'string'
                        };
                        //TODO: Infer datatype here
                    }
                }
            }
            this._private.model = {
                fields : config.fields
            };
        }
        this._private.recType = config.recType;
        delete config.recType;
        this._private.url = config.url || '/' + config.recType + '/read';
        this._private.saveurl = config.saveUrl || '/' + config.recType + '/save';
        this._private.dirtyCount = 0;
        delete config.url;
        delete config.saveurl;

        if (glu.isFunction(config.params)) {
            this._private.paramGenerator = config.params;
            delete config.params;
        }

        //load in initial values into record
        if (Ext.getVersion().major > 3 || Ext.getProvider().provider == 'touch') {
            //TODO: Make sure we only create the models once ... fix the "rectype" system so that
            //it more closely mimics Ext 4.0 models
            var modelId = Ext.id();
            Ext.define(modelId, {
                extend : 'Ext.data.Model',
                fields : this._private.model.fields
            });
            this.reader = new Ext.data.reader.Json({
                model : modelId
            });
        } else {
            this.reader = new Ext.data.JsonReader({}, this._private.model.fields);
        }
        //TODO: clean this up by calling loadData instead
        //workaround for new Ext 4.1 behavior...
        var idProp = 'id';
        if (config[idProp] === undefined) {
            config[idProp] = '';
        }
        var initialRecord = this.reader.readRecords([
        config
        ]).records[0];
        this._private.record = initialRecord;
        glu.apply(this, initialRecord.data);
        this._private.data = this._private.data || {};
        glu.apply(this._private.data, initialRecord.data);
        //create isDirty formulas

        this._private.record.fields.each(function(rec) {
            var name = rec.name + 'IsDirty';
            config[name] = {
                on : [rec.name + 'Changed'],
                formula : function() {
                    return this.isModified(rec.name);
                }
            }
        }, this);

        config.isDirty = false;
        //call Viewmodel constructor
        glu.DataModel.superclass.constructor.apply(this, arguments);
        glu.log.debug('END datamodel construction');
    },

    setRaw : function(fieldName, value, suppressDirtyEvent) {
        var rec = this._private.record;
        //check if part of fields and if so, set it in the record too...
        if (rec.fields.containsKey(fieldName)) {
            var wasDirty = this.isModified(fieldName);
            rec.set(fieldName, value);
            if (rec.modified && value == rec.modified[fieldName]) {
                //remove dirty indicator
                delete rec.modified[fieldName];
            }
            var isDirtyNow = this.isModified(fieldName);
            if (!wasDirty && isDirtyNow)
                this._private.dirtyCount++;
            if (wasDirty && !isDirtyNow)
                this._private.dirtyCount--;

        }
        glu.DataModel.superclass.setRaw.apply(this, arguments);
        if (rec.fields.containsKey(fieldName)) {
            this.set('isDirty', this._private.dirtyCount > 0);
        }
    },

    isModified : function(propName) {
        var rec = this._private.record;
        return rec.hasOwnProperty('modified') && rec.modified.hasOwnProperty(propName);
    },

    asObject : function() {
        return glu.apply({}, this._private.record.data);
    },

    load : function(id) {
        var url = this.url;
        if (this.appendId) {
            url = url + (glu.string(url).endsWith('/') ? '' : '/') + id;
        }
        if (this.paramGenerator) {
            var config = {
                params : {}
            };
            config.params = glu.apply(config.params, this._serialize(Ext.createDelegate(this._private.paramGenerator, this)()));
        }
        var jsonData = {
            id : id
        };
        if (config.params) {
            jsonData.params = config.params;
        }
        Ext.Ajax.request({
            url : url,
            method : 'POST',
            jsonData : jsonData,
            scope : this,
            success : function(response, opts) {
                var responseObj = Ext.decode(response.responseText);
                if (responseObj.success) {
                    var data = responseObj[this.root];
                    this.loadData(data);
                } else {
                    Ext.Msg.alert('Status', responseObj.message);
                }
            }
            // failure: function(response, opts) {
            // var responseText = (response.responseText ? response.responseText : 'Unable to contact the server.  Please try again later.');
            // Ext.Msg.alert('Status', 'Unable to contact the server.  Please try again later.');
            // }
        });
    },
    save : function() {
        var url = this.saveurl;
        if (this.appendId) {
            url = url + (glu.string(url).endsWith('/') ? '' : '/') + id;
        }
        if (this._private.paramGenerator) {
            var config = {
                params : {}
            };
            config.params = glu.apply(config.params, this._serialize(Ext.createDelegate(this._private.paramGenerator, this)()));
        }
        var jsonData = {
            model : this._private.model.name,
            data : this.getChanges(),
            id : this.getId()
        };
        if (config.params) {
            jsonData.params = config.params;
        }
        Ext.Ajax.request({
            url : url,
            method : 'POST',
            jsonData : jsonData,
            scope : this,
            success : function(response, opts) {
                var responseObj = Ext.decode(response.responseText);
                if (responseObj.success) {
                    var data = responseObj[this.root];
                    // if we got data back, then replace the existing record with this newly established record.
                    if (data) {
                        this._private.record = new this._private.record(data, data[this._private.model.idProperty]);
                        this.loadData(data);
                    } else {
                        this._private.record.commit(true);
                    }
                } else {
                    Ext.Msg.alert('Status', responseObj.message);
                }
            },
            failure : function(response, opts) {
                //                var responseText = (response.responseText ? response.responseText : 'Unable to contact the server.  Please try again later.');
                Ext.Msg.alert('Status', 'Unable to contact the server.  Please try again later.');
            }
        });
    },

    getFieldModel : function() {
        return this._private.model;
    },

    _serialize : function(data) {
        if (data) {
            for (var k in data) {
                if (glu.isArray(data[k])) {
                    data[k] = glu.json.stringify(data[k]);
                }
            }
        }
        return data;
    },
    loadData : function(rawData) {
        //workaround for new Ext 4.1 behavior...
        var idProp = 'id';
        if (rawData[idProp] === undefined) {
            rawData[idProp] = '';
        }
        var data = this.reader.readRecords([
        rawData
        ]).records[0].data;
        for (var k in data) {
            this.setRaw(k, data[k]);
        }
        this.commit();
    },
    getId : function() {
        return this._private.record.get(this._private.model.idProperty);
    },
    getFieldConfig : function(fieldName) {
        // TODO: convert model fields to objects instead of arrays, globally
        for (var i = 0; i < this._private.model.fields.length; i++) {
            if (this._private.model.fields[i].name == fieldName) {
                return this._private.model.fields[i]
            }
        }
        return null;
    },

    commit : function() {
        this._private.record.commit(true);
        for (var i = 0; i < this._private.model.fields.length; i++) {
            var field = this._private.model.fields[i].name || this._private.model.fields[i];
            this.set(field + 'IsDirty', false);
        }
        this._private.dirtyCount = 0;
        this.set('isDirty', false);
    },

    getOriginalValue : function(fieldName) {
        if (this.isModified(fieldName)) {
            return this._private.record.modified[fieldName];
        } else {
            return this.get(fieldName);
        }
    },
    getChanges : function() {
        return this._private.record.getChanges();
    },
    revert : function() {
        this._private.record.reject(true);
        this.loadData(this._private.record.data);
        this.commit();
    }
});

glu.mreg('datamodel', glu.DataModel);
