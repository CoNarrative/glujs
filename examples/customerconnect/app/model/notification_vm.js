glu.defModel('ps.notification', {
    fields: ps.models.notification,
    iconClass$:function(){
        if (this.type ==='email') return 'icon-envelope-alt'
        if (this.type ==='message') return 'icon-keyboard'
        if (this.type ==='response') return 'icon-reply'
    },
    currentWidthOfSubjectField:'',
    when_currentWidthOfSubjectField_changes:{
        on:'currentWidthOfSubjectFieldChanged',
        action:function(){
            console.log(this.currentWidthOfSubjectField);
        }
    },
    shortMessage$:function(){
        var deviceType = this.rootVM.deviceType;
        if(deviceType ==='Desktop') return this.message.substring(0,200);
        if(deviceType ==='Tablet') return this.message.substring(0,100);
        if(deviceType ==='Phone') return this.message.substring(0,50);
    }
});

