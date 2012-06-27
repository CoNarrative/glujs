glu.defModel('helloworld.main', {
    arriving:true,
    message$:function () {
        return this.localize(this.arriving ? 'greeting' : 'farewell')
    }
});

glu.defView('helloworld.main', {
    title:'@{message}',
    tbar:[
        {
            text:'Toggle',
            enableToggle:true,
            pressed:'@{arriving}'
        }
    ]
});

glu.ns('helloworld').locale = {
    greeting:'Hello World!',
    farewell:'Goodbye World!'
}

//moved to helloworld.jade
//Ext.onReady(function(){glu.viewport('helloworld.main')});
