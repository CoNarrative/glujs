glu.namespace('ps.models').notification = {
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'message',
            type: 'string'
        },
        {
            name:'subject',
            type:'string'
        },
        {
            name: 'created',
            type: 'date'
        },
        {
            name: 'type',
            type: 'string',
            oneOf : ['email','message','response']
        },
        {
            name: 'priority',
            type: 'number',
            oneOf : [1,2,3,4,5]
        }
    ]
};