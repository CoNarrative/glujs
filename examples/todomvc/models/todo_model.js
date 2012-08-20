glu.namespace('todo.models').task = {
    fields:[
        {
            name:'id',
            type:'int'
        },{
            name:'description',
            type:'string'
        },{
            name:'priority',
            type:'string',
            oneOf : ['high','medium','low']
        },{
            name:'lastUpdated',
            type:'date'
        }
    ]
};