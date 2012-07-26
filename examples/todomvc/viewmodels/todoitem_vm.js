glu.defModel('todo.todoitem', {
    text:'',
    done:false,
    focused:false,
    remove:function () {
        this.parentVM.remove(this);
    },
    removeIsVisible$:function () {
        return this.focused;
    },

    //TODO: Figure out first-order-logic semantics to allow attachment from outside to any changes inside
    when_done_changes_notify_parent:{
        on:'donechanged',
        action:function () {
            this.parentVM.notifyDoneChanged();
        }
    }
});