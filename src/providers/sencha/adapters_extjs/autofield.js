/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.autofield
 * @author Mike Gai, Nick Tackes
 *
 * ##Glu Virtual Component
 * This is not an actual component but a "virtual component". When you use the 'autofield' as an xtype, this adapter actually *transforms*
 * the existing configuration and assigns the xtype for you. It does this by looking up the given name on the data model
 * to which the control is bound to determine its type, then generating a configuration that best matches.
 *      glu.ns('sample.viewmodels').student = {
 *          fields : [{
 *              name : 'firstName'
 *          },{
 *              name : 'lastName'
 *          },{
 *              name : 'active',
 *              type : 'boolean'
 *          }]
 *      }
 *      glu.ns('sample.views').student = {
 *          xtype : 'form',
 *          defaultType : 'autofield',
 *          items : [{
 *              name : 'firstName'
 *          },{
 *              name : 'lastName'
 *          },{
 *              name : 'active'
 *          }]
 *      }
 * The 'active' field will become a yes/no radio button. The point is that you are specifying just the bare minimum to logically order
 * your fields, while letting a common bit of code make the actual rendering decision. This pattern is be useful when
 * you want to strongly enforce your field / form patterns. Since glu also automatically converts any string in an items array into named configuration object
 *      items: ['foo'] --> items: [{name: 'foo'}]
 * the recommended form for defining the view is instead:
 *       glu.ns('sample.views').student = {
 *          xtype : 'form',
 *          defaultType : 'autofield',
 *          items : ['firstName','lastName','active']
 *      }
 * Note that this straightforward transformation pattern is difficult with vanilla Ext JS as controls are statically typed
 * and plugins are not invoked until after the (static) control constructor has been invoked.
 *
 * The autofield transformer is not (yet) meant to be a general-purpose transformer, but more of an example off of which
 * you can create your own transformers for your particular project. In the future we will be investigating making this
 * more configurable so that you can use it 'out of the box'.
 */
glu.regAdapter('autofield', {
    beforeCollect:(function () {
        function getField(name) {
            return this.fieldsMap[name];
        }

        return function (config, dataModel) {
            var key = config.name;
            var field;
            if (dataModel.mtype === 'datamodel') {
                var model = dataModel.getFieldModel();
                if (model.fieldsMap === undefined) {
                    var lookup = {};
                    for (var i = 0; i < model.fields.length; i++) {
                        var field = model.fields[i];
                        lookup[field.name] = field;
                    }
                    model.fieldsMap = lookup;
                }
                ;

                model.getField = model.getField || getField;

                field = model.getField(key);
                if (!field) {
                    config.xtype = 'displayfield'
                    return;
                }
            } else {
                //TODO: Generalize property meta-information into view model, not here!!!
                field = dataModel.getPropertyInfo(key);
            }
            var xtype = 'textfield';
            if (dataModel[key+'$']){
                //formulas are always display-only
                xtype = 'displayfield';
            } else
            if (field.name == 'id') {
                //anything named id is read-only unless otherwise indicated
                xtype = 'displayfield';
            }
            else if (field.oneOf) {
                //one of several values
                xtype='combo';
                var dataType = glu.getDataTypeOf(field.oneOf[0]);
                var data = [];
                for (var i = 0; i < field.oneOf.length; i++) {
                    var fieldKey = field.oneOf[i];
                    data.push({
                        text:glu.localize(fieldKey, {viewmodel:dataModel}),
                        value:fieldKey
                    });

                }
                var backingStore = new Ext.data.Store({
                    fields:['text', {name:'value', type:dataType}],
                    data:data
                });
                glu.applyIf(config, {
                    triggerAction:'all',
                    mode:'local',
                    store:backingStore,
                    displayField:'text',
                    valueField:'value',
                    forceSelection:true
                })
            }
            else if (field.hasOwnProperty('lookup')) {
                xtype = 'combo';
                // TODO: standardization of display/value field names?  better way of accessing them?
                var displayField = 'text';
                var valueField = 'value';
                var ns = eval(dataModel.ns);
                if (ns.lookups && ns.lookups[field.lookup]) {
                    if (Ext.getVersion().major > 3 && ns.lookups[field.lookup].fields === undefined) {
                        //cache the default fields into the model constructor to make 4.0 behave like Ext 3.2
                        ns.lookups[field.lookup].fields = new ns.lookups[field.lookup].model().fields;
                    }
                    // assume the code is ordered first in the meta data
                    valueField = ns.lookups[field.lookup].fields.keys[0];
                    displayField = ns.lookups[field.lookup].fields.keys[1];
                }
                config.triggerAction = 'all';
                //                config.lazyRender = true;
                config.mode = 'local';
                config.store = glu.conventions.build().start().root().literal(dataModel.ns).lookupNs().prop(field.lookup).end();
                config.displayField = displayField;
                config.valueField = valueField;
            }
            else if (field.type == 'integer' || field.type == 'int' || field.type == 'number') {
                xtype = 'numberfield';
            }
            else if (field.type == 'boolean') {
                xtype = 'checkbox';
//                xtype = 'radiogroup';
//                config.items = [
//                    {xtype:'radio', name:field.name, boxLabel:'Yes', inputValue:'true'},
//                    {xtype:'radio', name:field.name, boxLabel:'No', inputValue:'false', checked:true }
//                ];
            }
            else if (field.type == 'date') {
                xtype = 'datefield'
            }

            config.xtype = xtype;
        }
    })()

});