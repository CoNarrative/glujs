glu.defView('todo.main', {
    title:'~~todo~~',
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