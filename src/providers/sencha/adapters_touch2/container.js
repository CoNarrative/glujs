/*
 * Copyright (c) 2012 CoNarrative
 */
glu.regAdapter('container', {
    extend:'component',
    applyConventions:function (config, viewmodel) {
        Ext.applyIf(config, {
            items : glu.conventions.expression(config.name)
        });
        this.callParent(arguments);
    },
    isChildArray:function (propName, value) {
        return propName === 'items' || propName === 'dockedItems';
    },
//    isChildObject:function(propName){
//        return propName ==='tbar' || propName === 'bbar';
//    },
    beforeCollect:function(config){
       // debugger;
    },
    beforeCreate:function(config){
        //debugger;
    },
    afterCreate:function(control,viewmodel)
    {
//        control.onItemAdd=function(item, index)
//        {
//            debugger;
//            //Custom override
//            this.doItemLayoutAdd(item, index);
//
//            if (this.initialized) {
//                this.fireEvent('add', this, item, index);
//            }
//        };
      //  control.setActiveItem(viewmodel.views._private.objs[0]);
      //  debugger;
      // control.doLayout();
      // control.setActiveItem(1);

    },
    activeItemBindings:{
        setComponentProperty:function (value, oldValue, options, control) {
            //TODO: added this check due to headless access.  if fails because layout is not rendered
            if (!control.getLayout() || !control.getLayout().setActiveItem) {
                return;
            }
            control.getLayout().setActiveItem(value);
        }
    },
    itemsBindings:{
        custom:function (context) {
            var activator = context.viewmodel.get(context.binding.modelPropName);
            var cardPanel = context.control;

            glu.provider.itemsHelper.bindItems(context);
            //do the items bindings using the helper

            //now Activation stuff if really an activator...
            if (activator.getActiveIndex) {
                if (cardPanel.rendered == true) {
                    cardPanel.getLayout().setActiveItem(activator.getActiveIndex());
                } else {
                    cardPanel.activeItem = activator.getActiveIndex();
                }

                //listen (automatically) to change event on activeIndex
                activator.on('activeindexchanged', function (newvalue) {
                    cardPanel._changeOriginatedFromModel = true;
                    if (cardPanel.rendered == true) {
                        cardPanel.setActiveItem(activator.getActiveIndex());
                    } else {
                        cardPanel.activeItem = activator.getActiveIndex();
                    }
                },context.viewModel);
            }
        }
    }
});