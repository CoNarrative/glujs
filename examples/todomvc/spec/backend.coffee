(glu.ns 'todo').createMockBackend = (auto, recordNum)->
  tasks = glu.test.createTable todo.models.task, 8
  tasks.create({id:'7777', description:'do stuff', priority:'high'});
  backend = glu.test.createBackend
    defaultRoot: '/json/',
    fallbackToAjax: auto,
    autoRespond: auto,
    routes:
      'removeTodos':
        url: 'todos/action/remove',
        handle: (req) -> todo.remove req.params.ids
      ,
      'requestVerification':
        url: 'todo/action/requestVerification',
        handle: (req) -> todo.update req.params.ids , {status:'verifying'}
      ,
      #TODO: Support "put" method
      'todoSave':
        url: 'todo/:id/action/save',
        handle: (req) -> todo.replace req.params.id , req.jsonData
      ,
      'todos':
        url: 'todo',
        handle: (req) -> todo.list req.params
      ,
      'todo':
        url: 'todo/:id',
        handle: (req) -> todo.get req.params.id
  backend.capture()
  return {backend: backend, tasks: tasks}
