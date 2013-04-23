describe("Given the Login Form", function () {
    /*
     * Create ViewModel
     */
    var vm = glu.model({
        ns: 'ks',
        mtype: 'login'
    });

    vm.init();
    it("when initialized the [LOGIN] button should be disabled", function () {
        expect(vm.loginIsDisabled).toBe(true);
    });
    it("when username field contains text the [LOGIN] button should be enabled", function () {
        vm.set('user','Bob')
        expect(vm.loginIsDisabled).toBe(false);
    });
});