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
        }, {
            name:'maintenanceStartDate',
            type:'date'
        }
    ]
};
var rowModel = glu.deepApply({
    formulas:{
        yearsMatter: function(){
            return this.status=='active';
        }
    }
},examples.assets.models.asset );
glu.defRowModel('examples.assets.models.Asset',rowModel);