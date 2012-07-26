glu.defModel('todo.main', {
    todoList:{
        mtype:'list'
    },
    newItemText : '',
    filterMode : 'all',
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
    notifyDoneChanged:function(){
        this.fireEvent('todolistchanged');
    },
    itemsLeft$:function () {
        var count = 0;
        for (var i=0;i<this.todoList.length;i++) {
            if (this.todoList.getAt(i).done === false) count++;
        }
        return count;
    },
    itemsLeftText$:function (){
        return this.localize('itemsLeft',{count:this.itemsLeft});
    },
    completedCount$:function (){
        return this.todoList.length - this.itemsLeft;
    },
    clearCompleted : function(){
        for (var i=this.todoList.length-1;i>-1;i--) {
            var item = this.todoList.getAt(i);
            if (item.done === true){
                this.remove(item);
            }
        }
    },
    clearCompletedText$:function (){
        return this.localize('clearCompleted', {count:this.completedCount});
    },
    clearCompletedIsVisible$:function(){
        return this.completedCount > 0;
    }
});