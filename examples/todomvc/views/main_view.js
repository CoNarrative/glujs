glu.defView('todo.main', {
    layout:'hbox',

    items:[
        {
            flex:1,
            border:false
        },
        {
            title:'~~todo~~',
            flex:1,
            layout:{
                type:'vbox',
                align:'stretch'
            },
            items:[
                {  //header
                    xtype:'textfield',
                    value:'@{newItemText}',
                    cls:'todo-newItemText',
                    emptyText:'~~newItemText~~',
                    enterKeyHandler:'@{addNewItem}'
                },
                { //list body
                    layout:'vbox',
                    items:'@{todoList}',
                    bbar:[
                        {
                            xtype:'displayfield',
                            value:'@{itemsLeftText}'
                        },
                        {
                            xtype:'tbspacer'
                        },
                        {
                            xtype:'buttongroup',
                            flex:1,
                            activeItem:'@{filterMode}',
                            items:[
                                {
                                    text:'~~all~~',
                                    value:'all'
                                },
                                {
                                    text:'~~active~~',
                                    value:'active'
                                },
                                {
                                    text:'~~completed~~',
                                    value:'completed'
                                }
                            ]
                        },
                        {
                            xtype:'tbfill'
                        },{
                            text : '@{clearCompletedText}',
                            handler : '@{clearCompleted}',
                            hidden : '@{!clearCompletedIsVisible}'
                        }
                    ]}

            ] }
        ,
        {
            flex:1,
            border:false
        }
    ]
});