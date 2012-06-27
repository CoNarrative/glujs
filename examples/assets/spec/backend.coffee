(glu.ns 'examples.assets').createMockBackend = (auto, recordNum)->
  assets = glu.test.createTable examples.assets.models.asset, 8
  assets.create({id:'7777', name:'aardvark',status:'active'});
  assets.create({id:'8888', name:'aare',status:'active'});
  assets.create({id:'9999', name:'aarf',status:'active'});
  backend = glu.test.createBackend
    defaultRoot: '/json/',
    fallbackToAjax: auto,
    autoRespond: auto,
    routes:
      'removeAssets':
        url: 'assets/action/remove',
        handle: (req) -> assets.remove req.params.ids
      ,
      'requestVerification':
        url: 'assets/action/requestVerification',
        handle: (req) -> assets.update req.params.ids , {status:'verifying'}
      ,
      #TODO: Support "put" method
      'assetSave':
        url: 'assets/:id/action/save',
        handle: (req) -> assets.replace req.params.id , req.jsonData
      ,
      'assets':
        url: 'assets',
        handle: (req) -> assets.list req.params
      ,
      'asset':
        url: 'assets/:id',
        handle: (req) -> assets.get req.params.id
  backend.capture()
  return {backend: backend, assets: assets}
