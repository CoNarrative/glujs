glu.defModel('todo.main', {
    todoList:{
        mtype:'list'
    },
    newItemText:'',
    filterMode:'all',

    addNewItem:function () {
        this.todoList.add(this.model({
            mtype:'todoitem',
            text:this.newItemText
        }));
        this.set('newItemText', '');
    },
    remove:function (item) {
        this.todoList.remove(item);
    },
    notifyDoneChanged:function () {
        this.fireEvent('todolistchanged');
    },
    activeCount$:function () {
        var count = 0;
        for (var i = 0; i < this.todoList.length; i++) {
            if (this.todoList.getAt(i).done === false) count++;
        }
        return count;
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
            if (item.done === true) {
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
        return this.todoList.length > 0;
    },
    batchComplete:function (value) {
        debugger;
        var me = this;
        this.todoList.each(function (item) {
            item.set('done', value)
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