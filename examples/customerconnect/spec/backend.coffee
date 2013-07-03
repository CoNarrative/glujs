(glu.ns 'ps.notification').createMockBackend = (auto, recordNum)->
  notifications = glu.test.createTable ps.models.notification, 30
#  assets.create({id:'7777', name:'aardvark',status:'active'});
#  assets.create({id:'8888', name:'aare',status:'active'});
#  assets.create({id:'9999', name:'aarf',status:'active'});
  backend = glu.test.createBackend
    defaultRoot: '/json/',
    fallbackToAjax: auto,
    autoRespond: auto,
    routes:
      'removeNotification':
        url: 'notifications/action/remove',
        handle: (req) -> notifications.remove req.params.ids
      ,
      'notificatioSave':
        url: 'notifications/:id/action/save',
        handle: (req) -> notifications.replace req.params.id , req.jsonData
      ,
      'notifications':
        url: 'notifications',
        handle: (req) ->
          reponse = notifications.list req.params
          reponse.success = true
          return reponse
      ,
      'notification':
        url: 'notifications/:id',
        handle: (req) -> notifications.get req.params.id
  backend.capture()
  return {backend: backend, notifications: notifications}
