/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.regAdapter('radiogroup', {
    extend : 'field',
    valueBindings:{
        eventName:'change',
        eventConverter:function (control, checked) {
            if (checked) {
                return checked.inputValue;
            }
            else {
                return control
            }

        }
    },
	isChildArray : function(propName, value){
        return propName==='editors' || propName==='items';
    },
	itemsBindings : {
        custom : function(context) {
            glu.provider.itemsHelper.bindItems(context, true);
        }
    }
});