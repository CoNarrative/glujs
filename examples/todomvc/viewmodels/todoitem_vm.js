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
    isVisible$:function(){
        var mode = this.parentVM.filterMode;
        return mode == 'all' || (mode == 'active' && this.done == false) || (mode=='completed' && this.done == true);
    },
    //TODO: Figure out first-order-logic semantics to allow accumulators from outside
    //e.g. in parent : this.todoList.count(function(){ this.done == true;});
    //and .count is recognized as 'live' accumulator that listens to any change on any child this.done
    //i.e. this.on ('todoList.*.donechanged')
    //meaning as items are added to list we start listening on them
    when_done_changes_notify_parent:{
        on:'donechanged',
        action:function () {
            this.parentVM.notifyDoneChanged();
        }
    }
});