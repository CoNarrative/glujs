(glu.ns 'ps.notification').createMockBackend = (auto, recordNum)->
  notifications = glu.test.createTable ps.models.notification, 10
  backend = glu.test.createBackend
    defaultRoot: '/json/',
    fallbackToAjax: auto,
    autoRespond: auto,
    routes:
      'removeNotification':
        url: 'notifications/action/remove',
        handle: (req) -> notifications.remove req.params.ids
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
      ,
      'notificationsummary':
        url:'notificationsummary',
        handle: (req) ->
          notificationsList = notifications.list ''
          typeCount = _.countBy(notificationsList.rows, (row)-> row.type);
          notificationSummary = {rows: [
            {id: glu.guid('e'), type: 'email', message: 'Priority e-mails received', count: typeCount['email']}
            {id: glu.guid('r'), type: 'response', message: 'Unread responses', count: typeCount['response']}
            {id: glu.guid('m'), type: 'message', message: 'New message', count: typeCount['message']}
            ], totalCount: 3, success: true}


  backend.capture()
  return {backend: backend, notifications: notifications}
