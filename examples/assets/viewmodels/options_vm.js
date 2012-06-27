glu.defModel('examples.assets.options', {
    warnings : true,
    offMaintenanceWarning : false,
    missingWarning : false,

    offMaintenanceWarningIsEnabled$ : function(){
        return this.warnings;
    },
    missingWarningIsEnabled$ : function(){
        return this.warnings;
    }
});