glu.defModel('todo.todoitem', {
    text:'',
    completed:false,
    focused:false,
    remove:function () {
        this.parentVM.remove(this);
    },
    removeIsVisible$:function () { return this.focused; },
    isVisible$:function(){
        var mode = this.parentVM.filterMode;
        return mode == 'all' || (mode == 'active' && this.completed == false) || (mode=='completed' && this.completed == true);
    },
    //TODO: Figure out first-order-logic semantics to allow accumulators from outside
    //e.g. in parent : this.todoList.count(function(){ this.completed == true;});
    //and .count is recognized as 'live' accumulator that listens to any change on any child this.completed
    //i.e. this.on ('todoList.*.completedchanged')
    //meaning as items are added to list we start listening on them
    when_completed_changes_notify_parent:{
        on:['completedchanged','isvisiblechanged'],
        action:function () {
            this.parentVM.notifyItemChanged();
        }
    }
});