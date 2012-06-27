Given 'the assets application', ->
  ns = examples.assets
  main = null
  firstAssetSet = null
  assetTable = null
  backend = null
  detail = null
  options = null

  #Some helper expectation builders
  detailArea = -> {vm:detail, name: ' detail area'}
  optionsDialog = -> {vm:options, name: 'options dialog'}
  vmScreen = -> {vm:main, name : 'vm screen'}
  ShouldHave_set = (name, value, getTarget) ->
    ShouldHave 'set ' + name + ' to ' + value + ' in ' + getTarget().name, -> expect(getTarget().vm.get name).toBe value
  ShouldHave_properties_of = (obj, getTarget) ->
    ShouldHave_set key, value, getTarget for own key, value of obj
  ShouldHave_enabled = (obj, getTarget) ->
    ShouldHave (if value==true then 'enabled ' else 'disabled ') + key + ' in ' + getTarget().name, (-> expect(getTarget().vm.get key + 'IsEnabled').toBe value) for own key, value of obj
  ShouldHave_invalidated_detail = -> ShouldHave 'invalidated the detail', -> expect(detail.isValid).toBe false
  ShouldHave_called_service = (name) -> ShouldHave 'called service ' + name, -> expect(backend.getRequestsFor(name).length).toBeGreaterThan(0)
  #End helper expectation builders
  
  Meaning ->
    # Create mock backend
    res = examples.assets.createMockBackend()
    assetTable = res.assetTable
    backend = res.backend
    ##Initialize view model
    main = glu.model
      ns: 'examples.assets'
      mtype: 'main'
    main.init()
    backend.respondTo('assets')
    detail = main.detail
    options = main.options
    firstAssetSet = main.assetSetList.getAt(0)
  ShouldHave_enabled {save:false, revert:false}, detailArea
  ShouldHave 'created a new view model', -> expect(main).toBeDefined()
  ShouldHave 'started with a blank filter', -> expect(firstAssetSet.get 'assetFilter').toBe ''
  ShouldHave 'started with a paging total of 11 rows', -> expect(firstAssetSet.assetList.getTotalCount()).toBe 11
  ShouldHave 'started with seeing only the first 5 paged rows', -> expect(firstAssetSet.assetList.count()).toBe 5
  ShouldHave 'loaded in alphabetic order, meaning aardvark first', -> expect(firstAssetSet.assetList.getAt(0).get('name')).toBe 'aardvark'
  When 'user opens global options', ->
    Meaning -> main.openOptions()
    ShouldHave_properties_of {warnings:true, offMaintenanceWarning:false, missingWarning:false}, optionsDialog
    ShouldHave_enabled {offMaintenanceWarning : true, missingWarning : true}, optionsDialog
    When 'user disables warnings', ->
      Meaning -> options.set 'warnings', false
      ShouldHave_properties_of {warnings:false, offMaintenanceWarning:false, missingWarning:false}, optionsDialog
      ShouldHave_enabled {offMaintenanceWarning : false, missingWarning : false}, optionsDialog
    When 'user enables off maintenance warning', ->
      Meaning -> options.set 'offMaintenanceWarning', true
      ShouldHave_properties_of {warnings:true, offMaintenanceWarning:true, missingWarning:false}, optionsDialog
      ShouldHave_enabled {offMaintenanceWarning : true, missingWarning : true}, optionsDialog
      When 'user disables warnings',->
        Meaning -> options.set 'warnings', false
        #Should still have sub properties set but not modifiable
        ShouldHave_properties_of {warnings:false, offMaintenanceWarning:true, missingWarning:false}, optionsDialog
        ShouldHave_enabled {offMaintenanceWarning : false, missingWarning : false}, optionsDialog
  When 'user clones an asset set', ->
    Meaning ->
      main.cloneSet()
      backend.respondTo 'assets'
    ShouldHave 'added a new set', -> expect(main.assetSetList.length).toBe 2
    ShouldHave 'loaded assets into the new set', -> expect(main.assetSetList.getAt(1).assetList.getTotalCount()).toBe 11
  When 'user selects an asset', ->
    selectedAsset = null
    Meaning ->
      selectedAsset = firstAssetSet.assetList.getAt(0)
      firstAssetSet.set 'assetWithFocus', selectedAsset
      firstAssetSet.set 'assetSelections', [selectedAsset]
      backend.respondTo('asset')
    ShouldHave 'loaded the detail with the appropriate record', -> expect(detail.get 'name').toBe 'aardvark'
    ShouldHave 'expanded the detail screen', -> expect(detail.isExpanded).toBe true

    When 'user executes run verification command', ->
      Meaning -> firstAssetSet.requestVerification()
      ShouldHave 'displayed progress message', ->expect(firstAssetSet.message).toHaveBeenCalled()
    When 'user sets status to storage', ->
      Meaning -> detail.set 'status', 'storage'
      ShouldHave_enabled {yearsOfMaintenance:false}, detailArea
      When 'user sets status back to active', ->
        Meaning -> detail.set 'status', 'active'
        ShouldHave_enabled {yearsOfMaintenance:true}, detailArea
    When 'user blanks out name', ->
      Meaning -> detail.set 'name', ''
      ShouldHave_invalidated_detail()
    When 'user edits name and adds a letter', ->
      Meaning -> detail.set 'name', 'aardvarks'
      ShouldHave_enabled {save:true, revert:true}, detailArea
      When 'user reverts changes', ->
        Meaning -> detail.revert()
        ShouldHave 'reverted change', ->expect(detail.name).toBe 'aardvark'
        ShouldHave_enabled {save:false, revert:false}, detailArea
      When 'user saves change', ->
        Meaning -> detail.save()
        ShouldHave 'kept change', ->expect(detail.name).toBe 'aardvarks'
        ShouldHave_enabled {save:false, revert:false}, detailArea
        ShouldHave_called_service 'assetSave'
        When 'the save service returns successfully', ->
          Meaning -> backend.respondTo('assetSave')
          ShouldHave_enabled {save:false, revert:false}, detailArea
          ShouldHave_called_service 'assets'
          ShouldHave_called_service 'asset'
          When 'the reload of asset returns first', ->
            Meaning -> backend.respondTo('asset')
            ShouldHave_enabled {save:false, revert:false}, detailArea
            ShouldHave 'kept the newly saved name', -> expect(detail.name).toBe 'aardvarks'
  When 'user selects two assets', ->
    selectedAsset1 = null
    selectedAsset2 = null
    Meaning ->
      selectedAsset1 = firstAssetSet.assetList.getAt(0)
      selectedAsset2 = firstAssetSet.assetList.getAt(1)
      firstAssetSet.set 'assetSelections', [selectedAsset1,selectedAsset2]
    When 'user executes remove command',->
      Meaning -> firstAssetSet.removeAssets()
      ShouldHave 'asked for confirmation', ->expect(firstAssetSet.confirm).toHaveBeenCalled()
      ShouldHave 'NOT called backend to remove asset', ->expect(backend.getRequestsFor('removeAssets').length).toBe 0
      When 'user confirms removal', ->
        Meaning -> firstAssetSet.confirm.respond('yes')
        ShouldHave_called_service 'removeAssets'
        When 'backend remove asset call returns OK',->
          Meaning -> backend.respondTo('removeAssets')
          ShouldHave_called_service 'assets'
          When 'grid request returns', ->
            Meaning -> backend.respondTo('assets')
            ShouldHave 'returned fewer assets', -> expect(firstAssetSet.assetList.getTotalCount()).toBe 9
    When 'user executes run verification command',->
      Meaning -> firstAssetSet.requestVerification()
      ShouldHave_called_service 'requestVerification'
      When 'backend run verification call returns',->
        Meaning -> backend.respondTo('requestVerification')
        ShouldHave_called_service 'assets'
        When 'grid request returns', ->
          Meaning -> backend.respondTo('assets')
          ShouldHave 'returned first asset with updated status', -> expect(firstAssetSet.assetList.getAt(0).get 'status').toBe 'verifying'
          ShouldHave 'returned second asset with updated status', -> expect(firstAssetSet.assetList.getAt(1).get 'status').toBe 'verifying'
          ShouldHave 'returned third asset with original status', -> expect(firstAssetSet.assetList.getAt(2).get 'status').not.toBe 'verifying'