/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.regAdapter('tabpanel', {
    extend : 'panel',

    items:{
        custom:function (context) {
            var tabpanel = context.control;
            tabpanel.activeTab = context.viewmodel.get(context.binding.modelPropName);
            if (context.valueSetTask === undefined) {
                context.valueSetTask = new Ext.util.DelayedTask(function () {
                });
            }

            context.viewmodel.on(context.binding.modelPropName + 'Changed', function (value) {
                context.valueSetTask.delay(1,function(){
                    tabpanel._changeOriginatedFromModel = true;
                    tabpanel.setActiveTab(value);
                    delete tabpanel._changeOriginatedFromModel;
                });
            });

            tabpanel.on('beforetabchange', function (tab, newpanel) {
                if (tabpanel._changeOriginatedFromModel) {
                    return true;
                }
                var newIndex = tab.items.indexOf(newpanel);
                context.viewmodel.set(context.binding.modelPropName, newIndex);
                return false;
            }, this);
        }

    }

});
