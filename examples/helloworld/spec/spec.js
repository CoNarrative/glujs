(function() {

  Given('the hello world app is launched', function() {
    var vm;
    vm = null;
    Meaning(function() {
      return vm = glu.model({
        ns: 'helloworld',
        mtype: 'main'
      });
    });
    ShouldHave('set arriving to true', function() {
      return (expect(vm.arriving)).toBe(true);
    });
    ShouldHave('set message to a welcome', function() {
      return (expect(vm.message)).toBe('Hello World!');
    });
    return When('the user changes his/her status', function() {
      Meaning(function() {
        return vm.set('arriving', false);
      });
      return ShouldHave('set message to a farewell', function() {
        return (expect(vm.message)).toBe('Goodbye World!');
      });
    });
  });

}).call(this);
