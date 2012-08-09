/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.regAdapter('radiogroup', {
    extend : 'field',
    valueBindings:{
        eventName:'change',
        eventConverter:function (field, newVal) {
            var selected = '';
            for( var key in newVal ){
                selected = newVal[key];
            }
            return selected;
            //return field.getValue()[field.items.getAt(0).name];
        },
        setComponentProperty:function(value,oldvalue,options,control){
            control.suspendCheckChange++;
            control.setValue(value);
            control.lastValue = value;
            control.suspendCheckChange--;
        }
    },
    itemsBindings:{
        custom:function (context) {
            glu.provider.itemsHelper.bindItems(context);
        }
    },
    isChildArray : function(propName, value){
        return propName==='editors' || propName==='items';
    }
});

glu.regAdapter('checkboxgroup', {
    extend : 'field',
    valueBindings:{
        eventName:'change',
        eventConverter:function (control, checked) {
            var checks = [];
            for( var key in checked ){
                if( checked[key] == 'on' ){
                    checks.push(key);
                }
            }
            return checks;
        },
        setComponentProperty: function(newValue, oldValue, options, control){
            var obj = {};
            for( var i = 0; i < newValue.length; i++){
                if( newValue[i] )
                    obj[newValue[i]] = true;
            }
            control.setValue(obj);
        }
    },
    itemsBindings:{
        custom:function (context) {
            glu.provider.itemsHelper.bindItems(context);
        }
    },
    isChildArray : function(propName, value){
        return propName==='editors' || propName==='items';
    }
});