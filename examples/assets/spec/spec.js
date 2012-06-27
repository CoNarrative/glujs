(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  Given('the assets application', function() {
    var ShouldHave_called_service, ShouldHave_enabled, ShouldHave_invalidated_detail, ShouldHave_properties_of, ShouldHave_set, assetTable, backend, detail, detailArea, firstAssetSet, main, ns, options, optionsDialog, vmScreen;
    ns = examples.assets;
    main = null;
    firstAssetSet = null;
    assetTable = null;
    backend = null;
    detail = null;
    options = null;
    detailArea = function() {
      return {
        vm: detail,
        name: ' detail area'
      };
    };
    optionsDialog = function() {
      return {
        vm: options,
        name: 'options dialog'
      };
    };
    vmScreen = function() {
      return {
        vm: main,
        name: 'vm screen'
      };
    };
    ShouldHave_set = function(name, value, getTarget) {
      return ShouldHave('set ' + name + ' to ' + value + ' in ' + getTarget().name, function() {
        return expect(getTarget().vm.get(name)).toBe(value);
      });
    };
    ShouldHave_properties_of = function(obj, getTarget) {
      var key, value, _results;
      _results = [];
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        value = obj[key];
        _results.push(ShouldHave_set(key, value, getTarget));
      }
      return _results;
    };
    ShouldHave_enabled = function(obj, getTarget) {
      var key, value, _results;
      _results = [];
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        value = obj[key];
        _results.push(ShouldHave((value === true ? 'enabled ' : 'disabled ') + key + ' in ' + getTarget().name, (function() {
          return expect(getTarget().vm.get(key + 'IsEnabled')).toBe(value);
        })));
      }
      return _results;
    };
    ShouldHave_invalidated_detail = function() {
      return ShouldHave('invalidated the detail', function() {
        return expect(detail.isValid).toBe(false);
      });
    };
    ShouldHave_called_service = function(name) {
      return ShouldHave('called service ' + name, function() {
        return expect(backend.getRequestsFor(name).length).toBeGreaterThan(0);
      });
    };
    Meaning(function() {
      var res;
      res = examples.assets.createMockBackend();
      assetTable = res.assetTable;
      backend = res.backend;
      main = glu.model({
        ns: 'examples.assets',
        mtype: 'main'
      });
      main.init();
      backend.respondTo('assets');
      detail = main.detail;
      options = main.options;
      return firstAssetSet = main.assetSetList.getAt(0);
    });
    ShouldHave_enabled({
      save: false,
      revert: false
    }, detailArea);
    ShouldHave('created a new view model', function() {
      return expect(main).toBeDefined();
    });
    ShouldHave('started with a blank filter', function() {
      return expect(firstAssetSet.get('assetFilter')).toBe('');
    });
    ShouldHave('started with a paging total of 11 rows', function() {
      return expect(firstAssetSet.assetList.getTotalCount()).toBe(11);
    });
    ShouldHave('started with seeing only the first 5 paged rows', function() {
      return expect(firstAssetSet.assetList.count()).toBe(5);
    });
    ShouldHave('loaded in alphabetic order, meaning aardvark first', function() {
      return expect(firstAssetSet.assetList.getAt(0).get('name')).toBe('aardvark');
    });
    When('user opens global options', function() {
      Meaning(function() {
        return main.openOptions();
      });
      ShouldHave_properties_of({
        warnings: true,
        offMaintenanceWarning: false,
        missingWarning: false
      }, optionsDialog);
      ShouldHave_enabled({
        offMaintenanceWarning: true,
        missingWarning: true
      }, optionsDialog);
      When('user disables warnings', function() {
        Meaning(function() {
          return options.set('warnings', false);
        });
        ShouldHave_properties_of({
          warnings: false,
          offMaintenanceWarning: false,
          missingWarning: false
        }, optionsDialog);
        return ShouldHave_enabled({
          offMaintenanceWarning: false,
          missingWarning: false
        }, optionsDialog);
      });
      return When('user enables off maintenance warning', function() {
        Meaning(function() {
          return options.set('offMaintenanceWarning', true);
        });
        ShouldHave_properties_of({
          warnings: true,
          offMaintenanceWarning: true,
          missingWarning: false
        }, optionsDialog);
        ShouldHave_enabled({
          offMaintenanceWarning: true,
          missingWarning: true
        }, optionsDialog);
        return When('user disables warnings', function() {
          Meaning(function() {
            return options.set('warnings', false);
          });
          ShouldHave_properties_of({
            warnings: false,
            offMaintenanceWarning: true,
            missingWarning: false
          }, optionsDialog);
          return ShouldHave_enabled({
            offMaintenanceWarning: false,
            missingWarning: false
          }, optionsDialog);
        });
      });
    });
    When('user clones an asset set', function() {
      Meaning(function() {
        main.cloneSet();
        return backend.respondTo('assets');
      });
      ShouldHave('added a new set', function() {
        return expect(main.assetSetList.length).toBe(2);
      });
      return ShouldHave('loaded assets into the new set', function() {
        return expect(main.assetSetList.getAt(1).assetList.getTotalCount()).toBe(11);
      });
    });
    When('user selects an asset', function() {
      var selectedAsset;
      selectedAsset = null;
      Meaning(function() {
        selectedAsset = firstAssetSet.assetList.getAt(0);
        firstAssetSet.set('assetWithFocus', selectedAsset);
        firstAssetSet.set('assetSelections', [selectedAsset]);
        return backend.respondTo('asset');
      });
      ShouldHave('loaded the detail with the appropriate record', function() {
        return expect(detail.get('name')).toBe('aardvark');
      });
      ShouldHave('expanded the detail screen', function() {
        return expect(detail.isExpanded).toBe(true);
      });
      When('user executes run verification command', function() {
        Meaning(function() {
          return firstAssetSet.requestVerification();
        });
        return ShouldHave('displayed progress message', function() {
          return expect(firstAssetSet.message).toHaveBeenCalled();
        });
      });
      When('user sets status to storage', function() {
        Meaning(function() {
          return detail.set('status', 'storage');
        });
        ShouldHave_enabled({
          yearsOfMaintenance: false
        }, detailArea);
        return When('user sets status back to active', function() {
          Meaning(function() {
            return detail.set('status', 'active');
          });
          return ShouldHave_enabled({
            yearsOfMaintenance: true
          }, detailArea);
        });
      });
      When('user blanks out name', function() {
        Meaning(function() {
          return detail.set('name', '');
        });
        return ShouldHave_invalidated_detail();
      });
      return When('user edits name and adds a letter', function() {
        Meaning(function() {
          return detail.set('name', 'aardvarks');
        });
        ShouldHave_enabled({
          save: true,
          revert: true
        }, detailArea);
        When('user reverts changes', function() {
          Meaning(function() {
            return detail.revert();
          });
          ShouldHave('reverted change', function() {
            return expect(detail.name).toBe('aardvark');
          });
          return ShouldHave_enabled({
            save: false,
            revert: false
          }, detailArea);
        });
        return When('user saves change', function() {
          Meaning(function() {
            return detail.save();
          });
          ShouldHave('kept change', function() {
            return expect(detail.name).toBe('aardvarks');
          });
          ShouldHave_enabled({
            save: false,
            revert: false
          }, detailArea);
          ShouldHave_called_service('assetSave');
          return When('the save service returns successfully', function() {
            Meaning(function() {
              return backend.respondTo('assetSave');
            });
            ShouldHave_enabled({
              save: false,
              revert: false
            }, detailArea);
            ShouldHave_called_service('assets');
            ShouldHave_called_service('asset');
            return When('the reload of asset returns first', function() {
              Meaning(function() {
                return backend.respondTo('asset');
              });
              ShouldHave_enabled({
                save: false,
                revert: false
              }, detailArea);
              return ShouldHave('kept the newly saved name', function() {
                return expect(detail.name).toBe('aardvarks');
              });
            });
          });
        });
      });
    });
    return When('user selects two assets', function() {
      var selectedAsset1, selectedAsset2;
      selectedAsset1 = null;
      selectedAsset2 = null;
      Meaning(function() {
        selectedAsset1 = firstAssetSet.assetList.getAt(0);
        selectedAsset2 = firstAssetSet.assetList.getAt(1);
        return firstAssetSet.set('assetSelections', [selectedAsset1, selectedAsset2]);
      });
      When('user executes remove command', function() {
        Meaning(function() {
          return firstAssetSet.removeAssets();
        });
        ShouldHave('asked for confirmation', function() {
          return expect(firstAssetSet.confirm).toHaveBeenCalled();
        });
        ShouldHave('NOT called backend to remove asset', function() {
          return expect(backend.getRequestsFor('removeAssets').length).toBe(0);
        });
        return When('user confirms removal', function() {
          Meaning(function() {
            return firstAssetSet.confirm.respond('yes');
          });
          ShouldHave_called_service('removeAssets');
          return When('backend remove asset call returns OK', function() {
            Meaning(function() {
              return backend.respondTo('removeAssets');
            });
            ShouldHave_called_service('assets');
            return When('grid request returns', function() {
              Meaning(function() {
                return backend.respondTo('assets');
              });
              return ShouldHave('returned fewer assets', function() {
                return expect(firstAssetSet.assetList.getTotalCount()).toBe(9);
              });
            });
          });
        });
      });
      return When('user executes run verification command', function() {
        Meaning(function() {
          return firstAssetSet.requestVerification();
        });
        ShouldHave_called_service('requestVerification');
        return When('backend run verification call returns', function() {
          Meaning(function() {
            return backend.respondTo('requestVerification');
          });
          ShouldHave_called_service('assets');
          return When('grid request returns', function() {
            Meaning(function() {
              return backend.respondTo('assets');
            });
            ShouldHave('returned first asset with updated status', function() {
              return expect(firstAssetSet.assetList.getAt(0).get('status')).toBe('verifying');
            });
            ShouldHave('returned second asset with updated status', function() {
              return expect(firstAssetSet.assetList.getAt(1).get('status')).toBe('verifying');
            });
            return ShouldHave('returned third asset with original status', function() {
              return expect(firstAssetSet.assetList.getAt(2).get('status')).not.toBe('verifying');
            });
          });
        });
      });
    });
  });

}).call(this);
