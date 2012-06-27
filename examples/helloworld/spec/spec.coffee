Given 'the hello world app is launched', ->
  vm = null
  Meaning -> vm = glu.model {ns:'helloworld',mtype:'main'}
  ShouldHave 'set arriving to true', -> (expect vm.arriving).toBe true
  ShouldHave 'set message to a welcome', -> (expect vm.message).toBe 'Hello World!'
  When 'the user changes his/her status', ->
    Meaning -> vm.set('arriving', false)
    ShouldHave 'set message to a farewell', -> (expect vm.message).toBe 'Goodbye World!'