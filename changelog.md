#Change Log

##1.1

###Enhancements

 * Multiple views per view model via new 'viewMode' view property
 * Ability to set/replace sub-models entirely using normal 'set' syntax (with automatic de-linking/linking of observer patterns)
 * Focus (activeTab and activeItem) bindings for tabs and cards
 * Two-way row grid selection binding (previously one-way)
 * Bindings for panel buttons, rbar, and lbar
 * Updated activator list with external "focus property" to keep flat and in-line with GluJS conventions
 
 
###Bug Fixes
 * Fixed issue with spinnerfield spin up/down arrows not binding
 * Fixed bug with bindings failing when using advanced transformers that modify the entire config block