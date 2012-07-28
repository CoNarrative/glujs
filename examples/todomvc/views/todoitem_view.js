glu.defView('todo.todoitem', {
    xtype:'container',
    layout:'hbox',
    isHovered : '@{focused}',
    height :30,
    hidden : '@{!isVisible}',
    items:[
        {
            xtype : 'checkbox',
            value : '@{completed}',
            width : 20
        },
        {
            xtype:'displayfield',
            width:300,  //flex isn't working for some reason...
            disabledCls : 'todo-item-completed',
            disabled : '@{completed}',
            value : {
                value:'@{text}',
                width:300,
                alignment : 'l-l?',
                field : {
                    xtype: 'textfield'
                }
            }
        },
        {
            xtype : 'button',
            width : 20,
            hidden : '@{!removeIsVisible}',
            overCls : '',
            handler : '@{remove}'
        }
    ]
});