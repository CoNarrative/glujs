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
    },
    itemsLeft$:function () {
        var count = 0;
        for (var i=0;i<this.todoList.length;i++) {
            if (this.todoList.getAt(i).done === false) count++;
        }
        return this.localize('itemsLeft',{count:count});
    }
});