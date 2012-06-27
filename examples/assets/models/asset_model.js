glu.namespace('examples.assets.models').asset = {
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
glu.defRowModel('examples.assets.models.Asset',{
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