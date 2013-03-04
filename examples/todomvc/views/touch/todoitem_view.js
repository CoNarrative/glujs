glu.defView('todo.todoitem', {
    xtype:'container',
    layout:'hbox',
    isHovered:'@{focused}',
    height:50,
    hidden:'@{!isVisible}',
    items:[
        {
            xtype:'checkboxfield',
            checked:'@{completed}',
            width:50,
            height:40
        },
        {
            xtype:'label',
            width:250, //flex isn't working for some reason...
            height:40,
            disabledCls:'todo-item-completed',
            disabled:'@{completed}',
            html:'@{text}'
//            html : {
//                html:'@{text}',
//                width:300,
//                alignment : 'l-l?',
//                field : {
//                    xtype: 'textfield'
//                }
//            }
        },
        {
            xtype:'button',
            iconCls:'delete',
            iconMask:true,
            handler:'@{remove}'
        }
    ]
});