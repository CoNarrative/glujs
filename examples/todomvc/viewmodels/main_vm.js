glu.defModel('todo.main', {
    todoList:{ mtype:'list' },
    newItemText:'',
    filterMode:'all',
    addNewItem:function () {
        this.todoList.add(this.model({
            mtype:'todoitem',
            text:Ext.String.trim(this.newItemText)
        }));
        this.set('newItemText', '');
    },
    remove:function (item) { this.todoList.remove(item); },
    notifyItemChanged:function () {
        this.fireEvent('todolistchanged');
    },
    activeCount$: function(){
        var l = this.todoList.length; //force for now!
        return this.todoList.count(function(item){ return item.completed === false;});
    },
    visibleCount$: function(){
        var l = this.todoList.length; //force for now!
        return this.todoList.count(function(item){ return item.isVisible === true;});
    },
    itemsLeftText$:function () {
        return this.localize('itemsLeft', {count:this.activeCount});
    },
    completedCount$:function () {
        return this.todoList.length - this.activeCount;
    },
    clearCompleted:function () {
        for (var i = this.todoList.length - 1; i > -1; i--) {
            var item = this.todoList.getAt(i);
            if (item.completed === true) {
                this.remove(item);
            }
        }
    },
    clearCompletedText$:function () {
        return this.localize('clearCompleted', {count:this.completedCount});
    },
    clearCompletedIsVisible$:function () {
        return this.completedCount > 0;
    },
    completeAllIsDisabled$:function () {
        return this.visibleCount > 0;
    },
    batchComplete:function (value) {
        console.log (value ? "Completing all" : "Uncompleting all")
        this.todoList.each(function (item) {
            if (item.isVisible) item.set('completed', value)
        });
    },
    allVisibleItemsAreCompleted$:function () {
        switch (this.filterMode) {
            case 'all' :
                return this.activeCount == 0 && this.todoList.length > 0;
            case 'active' :
                return false;
            case 'completed' :
                return this.completedCount > 0;
        }
    }
});