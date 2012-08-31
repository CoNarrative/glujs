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
  #Should 'todo list is empty', -> expect(main.todoList.length).toBe 0
  When 'User clicks add button', ->
    Meaning ->
      main.set 'newItemText', '    Finish Todo spec     '
      main.addNewItem()
      newItem = main.todoList.getAt(0)
    Should 'change new item text to empty', -> expect(newItem.text).toBe('Finish Todo spec');
    Should 'add new todo ', -> expect(main.todoList.length).toBe(1);
    Should 'trim new todo text', -> expect(newItem.text).toBe('Finish Todo spec');
    Should 'set items left to 1', -> expect(main.activeCount).toBe(1)
    When 'User clicks the delete icon', ->
      Meaning ->
        main.remove(newItem)
      Should 'remove item from todo list', -> expect(main.todoList.length).toBe(0)
      Should 'set items left to 0', -> expect(main.activeCount).toBe(0)

