glu.defView('todo.todoitem', {
    xtype:'container',
    layout:'hbox',
    items:[
        {
            xtype:'textfield',
            value:'@{text}'
        },
        {
            xtype : 'button',
            name : 'remove'
        }
    ]
});