glu.namespace('todo.models').asset = {
    fields:[
        {
            name:'id',
            type:'int'
        },
        {
            name:'name',
            type:'string'
        },
        {
            name:'status',
            type:'string',
            oneOf : ['active','storage','verifying']
        },
        {
            name:'lastVerified',
            type:'date'
        }, {
            name:'yearsOfMaintenance',
            type:'number'
        }
    ]
};
glu.defRowModel('todo.models.Asset',{
    fields:[
        {
            name:'id',
            type:'int'
        },
        {
            name:'name',
            type:'string'
        },
        {
            name:'status',
            type:'string',
            oneOf : ['active','storage','verifying']
        },
        {
            name:'lastVerified',
            type:'date'
        }, {
            name:'yearsOfMaintenance',
            type:'number'
        }
    ] ,
    formulas:{
        yearsMatter: function(){
            return this.status=='active';
        }
    }
});