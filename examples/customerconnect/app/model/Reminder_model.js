glu.namespace('ps.models').reminder = {
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
            name: 'created',
            type: 'date'
        },
        {
            name: 'type',
            type: 'string',
            oneOf : ['meeting','call']
        },
        {
            name: 'priority',
            type: 'number',
            oneOf : [1,2,3,4,5]
        }
    ]
};