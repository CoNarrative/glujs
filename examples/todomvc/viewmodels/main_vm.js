glu.defModel('todo.main', {
    todoList:{
        mtype:'list'
    },
    newItemText : '',
    addNewItem : function(){
        this.todoList.add(this.model({
            mtype : 'todoitem',
            text : this.newItemText
        }));
        this.set('newItemText','');
    },
    remove:function (item) {
        this.todoList.remove(item);
    }
});