glu.defModel('ks.login', {
    title: 'Login Form',
    name: '',
    user: '',
    pass: '',
    remember: '',
//    isUserNameValid$: function () {
//        return Ext.isEmpty(this.user)
//    },
    login:function(){

    },
    loginIsDisabled$:function(){
        return Ext.isEmpty(this.user)  //Return true to disable the login button
    }
});