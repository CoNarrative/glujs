glu.defView('todo.main', {
    centered:false,

    border:false,
    layout:{
        type:'vbox'
    },
    items:[
        {
            docked:'top',
            xtype:'titlebar',
            items:[
                {
                    xtype:'label',
                    html:'~~todo~~'
                }
            ]
        },
        {
            layout:'hbox',
            height:50,
            items:[
                {
                    xtype:'checkboxfield',
                    checked:'@>{allVisibleItemsAreCompleted}',
                    disabled:'@{!completeAllIsDisabled}',
                    width:50,
                    height:40,
                    //handler : '@{batchComplete}'
                    listeners:{
                        checkedChanged:'@{batchComplete}'
                    }
                },
                {
                    xtype:'textfield',
                    value:'@{newItemText}',
                    cls:'todo-newItemText',
                    placeHolder:'~~newItemText~~',
                    enterKeyHandler:'@{addNewItem}',
                    width:300,
                    height:40
                }


            ]
        },
        { //list body
            layout:'vbox',
            flex:1,
            scrollable:{
                direction:'vertical',
                directionLock:true
            },

            items:'@{todoList}'
        },
        {
            xtype:'toolbar',
            height:50,
            docked:'bottom',
            items:[
                {   xtype:'button',
                    text:'~~all~~',
                    value:'all'
                },
                {
                    xtype:'button',
                    text:'~~active~~',
                    value:'active'
                },
                {   xtype:'button',
                    text:'~~completed~~',
                    value:'completed'
                }
            ]
        }


    ]
});