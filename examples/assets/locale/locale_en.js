glu.namespace('examples.assets').locale = {
    id:'Id',
    name:'Name',
    save : 'Save',
    revert : 'Revert',
    valid_needOneCharacter:'The name cannot be empty',
    main :{
        title: 'Asset Management ({focusName})',
        openOptions: 'Options'
    },
    asset:{
        status:'Status',
        title :'Asset Detail',
        scheduleTitle : 'Schedule',
        inspectorTitle : 'Asset Inspector',
        yearsOfMaintenance : 'Years Of Maintenance',
        yearsOfMaintenanceRemaining : 'Remaining',
        maintenanceStartDate : 'Maintenance Start',
        maintenanceEndDate: 'Maintenance End',
        lastVerified:'Last Verified',
        active : 'Active',
        storage : 'Storage',
        verifying : 'Verifying'
    },
    options : {
        title : 'Asset Options',
        warnings : 'Enable warnings',
        offMaintenanceWarning : 'Enable off-maintenance warnings',
        missingWarning : 'Enable gone-missing warnings'
    },
    cloneSet : 'Clone set',
    requestVerification:'Request Verification',
    removeAssets:'Remove',

    verifyBegin:'Initiated verification on {assetSelections.length} asset(s)',
    removeAssetsTitle:'Remove assets',
    removeAssetsMessage:'This will archive {assetSelections.length} asset(s). Would you like to continue?'
}
