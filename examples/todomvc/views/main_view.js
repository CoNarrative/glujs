glu.defView('todo.main', {
    title:{
        value:'Hello',
        field:{
            xtype:'textfield'
        }
    },
    layout:'vbox',
    items:[
        {  //header
            xtype:'textfield',
            value : '@{newItemText}',
            enterKeyHandler : '@{addNewItem}'
        },
        { //list body
            layout : 'vbox',
            items : '@{todoList}'
        },
        { //footer
            layout : 'hbox',
            defaultType : 'displayfield',
            items : [{value:'@{itemsLeft}'}]
        }
    ]
});