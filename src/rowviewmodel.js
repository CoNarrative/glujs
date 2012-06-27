/*
 * Copyright (C) 2012 by CoNarrative
 */
/* DOCS DISABLED FOR NOW
 * @class glu.RowViewmodel
 * An extremely lightweight version of a view model that just has formulas (for now).
 * Very useful to get reactive behavior in grids where items can automatically update without a grid refresh
 * or based on other columns locally changing.
 * Available (at the moment) only for Ext 4.x +
 */
if (Ext.getVersion().major > 3 || Ext.getProvider().provider == 'touch') {
    Ext.define('glu.rowViewmodel', {
        extend:'Ext.data.Model',

        initFormulas : function(){
            for (var formulaName in this.formulas) {
                var fn = this.formulas[formulaName];
                glu.Reactor.build(formulaName, {on:'$', formula:fn}, this, this.data);
            }
            for (var formulaName in this.formulas) {
                var fn = this.formulas[formulaName];
                this.data[formulaName] = fn.apply(this.data);
            }
        },

        //LIVE CHANGE STEP 3a: Keeps getting called until formulas done processing
        //TODO: True dependency graph...
        setRaw:function (formulaName, value) {
            //if the formula has changed within this cycle or since last update, put on the update list
            if ((this.formulasToUpdate[formulaName] && this.formulasToUpdate[formulaName] != value) ||
                this.get(formulaName) != value) {
                this.formulasToUpdate[formulaName] = value;
                this.fireEvent(formulaName + 'Changed', value, this.formulasToUpdate[formulaName] || this.get(formulaName));
            }
        },

         //LIVE CHANGE STEP 4a: add the accumulated formula changes to the property
        afterEdit:function (modifiedFieldNames) {
            if (this.settingFormulas) {
                //do nothing when accumulating formula changes NOTE: Not used at the moment
                return;
            }
            var name = modifiedFieldNames[0];
            this.formulasToUpdate = {};
            this.fireEvent(name + 'Changed', this.data[name]);
            //formulas have finished accumulating

            for (var fName in this.formulasToUpdate) {
                this.data[fName] = this.formulasToUpdate[fName];
                modifiedFieldNames.push(this.formulasToUpdate[fName]);
            }
            this.settingFormulas = false;
            this.callParent(modifiedFieldNames);
        }

    });


    glu.defRowModel = function (name, config) {
        if (config.formulas) {
            for (var formulaName in config.formulas) {
                config.fields.push({
                    name:formulaName
                });
            }
        }
        config.extend = 'glu.rowViewmodel'
        Ext.define(name, config);
    };

    Ext.define('glu.Reader', {
        extend:'Ext.data.reader.Json',
        alias:'reader.glujson',
        extractData:function () {
            var records = this.callParent(arguments);
            if (this.model.prototype.formulas) {
                for (var i = 0; i < records.length; i++) {
                    var rec = records[i];
                    rec.initFormulas();
                }
            }
            return records;
        }
    });

}

