glu.defModel('ps.notification', {
    fields: ps.models.notification,
    iconClass$:function(){
        if (this.type ==='email') return 'icon-envelope-alt'
        if (this.type ==='message') return 'icon-keyboard'
        if (this.type ==='response') return 'icon-reply'
    }
});

