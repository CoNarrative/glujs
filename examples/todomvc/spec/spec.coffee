Given 'the todo application', ->
  ns = todo
  main = null
  newItem = null

  Meaning ->
    res = todo.createMockBackend()
    backend = res.backend
    main = glu.model
      ns: 'todo'
      mtype: 'main'
    main.init()
  ShouldHave 'todo list is empty', -> expect(main.todoList.length).toBe 0
  When 'User clicks add button', ->
    Meaning ->
      main.set 'newItemText', '    Finish Todo spec     '
      main.addNewItem()
      newItem = main.todoList.getAt(0)
    ShouldHave 'change new item text to empty', -> expect(newItem.text).toBe('Finish Todo spec');
    ShouldHave 'change new item text '
    ShouldHave 'add new todo ', -> expect(newItem.text).toBe('Finish Todo spec');


