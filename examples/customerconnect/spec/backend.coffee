(glu.ns 'ps.notification').createMockBackend = (auto, recordNum)->
  notifications = glu.test.createTable ps.models.notification, 10
  notifications.create({id:glu.guid('in'), name:'Howard Jeff',subject:'Long subject line and a large message to go with it',message:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis tincidunt diam, ac congue quam adipiscing eu. Suspendisse non venenatis tellus, quis consequat magna. Morbi dui velit, facilisis non porttitor sed, dictum id augue. Aenean nulla turpis, porttitor vitae eros id, varius dictum elit. Pellentesque id risus a augue rhoncus sagittis. Pellentesque quis elementum sapien. Nullam aliquam sagittis suscipit. Nullam consectetur, lectus non malesuada varius, quam ipsum cursus neque, in malesuada tellus nibh vitae justo. Phasellus ac aliquet eros. Ut blandit erat elementum malesuada ultricies. Curabitur turpis erat, hendrerit et euismod consequat, interdum quis massa.
  Mauris interdum dignissim arcu id cursus. Curabitur id volutpat metus. Sed semper, odio quis dictum rhoncus, purus tortor aliquam mi, ultricies placerat mi nisl ullamcorper purus. Etiam enim orci, scelerisque vitae velit ut, fringilla interdum enim. Mauris sagittis sapien at massa aliquet, at rutrum lorem condimentum. Sed neque lacus, lobortis sit amet ultricies in, volutpat sit amet tellus. Nullam fringilla nisi et cursus viverra. Nam quis est eleifend, suscipit urna a, ultricies erat. Nunc lacinia nisi eu arcu sagittis ullamcorper.

  Donec lacinia sollicitudin convallis. Nulla fermentum lorem nulla, eget laoreet lorem interdum non. Vivamus et porttitor neque. Integer tristique faucibus vehicula. Quisque luctus nunc non nisi rhoncus aliquet. Etiam sed dui et tortor porttitor molestie. Nulla facilisi. In hac habitasse platea dictumst. Phasellus at ante nec arcu pulvinar interdum.

  Nunc adipiscing odio ipsum, ac ornare magna viverra non. Quisque sed congue lacus. Vivamus mollis diam at nisi dignissim, at tincidunt ipsum tincidunt. Cras in risus at ipsum placerat interdum at et augue. Sed posuere purus in sem rutrum convallis nec sed ipsum. Donec vitae auctor risus, eget laoreet nibh. Etiam nec condimentum urna, vehicula consequat eros. Nulla quis eleifend ligula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed commodo aliquet vestibulum. Pellentesque gravida sapien quis quam fringilla pulvinar. Nullam felis ligula, vulputate sit amet tincidunt eu, vulputate eget augue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam blandit lacus sed velit fringilla, nec pellentesque quam blandit. Suspendisse hendrerit cursus iaculis.

  Aliquam vulputate urna metus, sit amet scelerisque magna accumsan eu. Proin feugiat accumsan lacinia. Vivamus aliquet ante elit, vel dictum metus fringilla non. Vestibulum vulputate pellentesque odio. Vestibulum eleifend, nisl at elementum egestas, arcu eros facilisis dolor, ac mattis risus metus nec diam. In nec sapien id sapien tincidunt convallis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel placerat libero.',created:'2013/07/01',type:'email',priority:5});
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
