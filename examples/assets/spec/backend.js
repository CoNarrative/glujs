(function() {

  (glu.ns('examples.assets')).createMockBackend = function(auto, recordNum) {
    var assets, backend;
    assets = glu.test.createTable(examples.assets.models.asset, 8);
    assets.create({
      id: '7777',
      name: 'aardvark',
      status: 'active'
    });
    assets.create({
      id: '8888',
      name: 'aare',
      status: 'active'
    });
    assets.create({
      id: '9999',
      name: 'aarf',
      status: 'active'
    });
    backend = glu.test.createBackend({
      defaultRoot: '/json/',
      fallbackToAjax: auto,
      autoRespond: auto,
      routes: {
        'removeAssets': {
          url: 'assets/action/remove',
          handle: function(req) {
            return assets.remove(req.params.ids);
          }
        },
        'requestVerification': {
          url: 'assets/action/requestVerification',
          handle: function(req) {
            return assets.update(req.params.ids, {
              status: 'verifying'
            });
          }
        },
        'assetSave': {
          url: 'assets/:id/action/save',
          handle: function(req) {
            return assets.replace(req.params.id, req.jsonData);
          }
        },
        'assets': {
          url: 'assets',
          handle: function(req) {
            return assets.list(req.params);
          }
        },
        'asset': {
          url: 'assets/:id',
          handle: function(req) {
            return assets.get(req.params.id);
          }
        }
      }
    });
    backend.capture();
    return {
      backend: backend,
      assets: assets
    };
  };

}).call(this);
