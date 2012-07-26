glu.defView('todo.todoitem', {
    xtype:'container',
    layout:'hbox',
    isHovered : '@{focused}',
    height :30,
    items:[
        {
            xtype : 'checkbox',
            value : '@{done}',
            width : 20
        },
        {
            xtype:'displayfield',
            width: 200,
            disabledCls : 'todo-list-done',
            disabled : '@{done}',
            value : {
                value:'@{text}',
                alignment : 'l-l?',
                field : {
                    xtype: 'textfield'
                }
            }
        },
        {
            xtype : 'button',
            hidden : '@{!removeIsVisible}',
            overCls : '',
            handler : '@{remove}'
        }
    ]
});