glu.defView('todo.main', {
    title:'~~todo~~',
    layout: {
        type: 'vbox',
        align:'stretch'
    },
    items:[
        {  //header
            xtype:'textfield',
            value : '@{newItemText}',
            cls: 'todo-newItemText',
            emptyText : '~~newItemText~~',
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