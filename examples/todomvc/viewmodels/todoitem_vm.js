glu.defModel('todo.todoitem', {
    text : '',
    done : false,
    textIsEditable$ : function(){
        return this.done === false;
    },
    remove : function(){
        this.parentVM.remove(this);
    }
});