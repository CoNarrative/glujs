# Change Log
Glu JS 1.2

## 1.2

### New
 * Added 'viewmode' as an option to this.open
 * Added support for viemodel.prompt
 * Views defined as functions now automatically default to being 'factories' without the need for a Factory suffix
 * Now view models are smarter about not instantiating already instantiated children
 * Added sub menu binding in nested menus
 * Added suppression of setChecked event side-effects in checkitem binder
 * Made binding to arrays a little smarter: array comparison is now part of glu.equivalent and controls always store an array copy as the previous value instead of the actual array.
 * Added a removeAtKey to keytracking mixin
 * Added a bit of support for use of short string names for field definitions in the commit function
 * Added commitBulkUpdate as (for now) a simple flag to signal views that much has changed (used in some bindings)
 * Added list.toArray
 * Added config to shortcut function so that you can get access to the other options of the configuration if needed (like in the case of buttons and fbar. Also added the pack configuration to buttons and bbar to take advantage of the new configuration being passed in
 * Added getById to keytracker mixin
 * Added key tracking mixing for list
 * Added bindings for 'tpl' that refresh only on a 'bulk update'


### Fixes
 * Fixed bug where close was being called on non-windows
 * Corrected message responder code to actually respond properly to the message if its called
 * Corrected message jasmine spy creation to create spec spys properly
 * Corrected card layout to handle initial activeItem
 * Corrected tabpanel bindings to work with tab changes and initial activeTab being set
 * Corrected list iteration method name from foreach to forEach
 * Fixed so that removing an object that is not contained by a list does nothing (instead of throwing an exception)
 * Fixed glu.extend to actually create namespace
 * Fixed breaking combo box test going other way.
 * Corrected combobox spec to use clock to advance and allow the delayedTask to properly fire
 * Made 'findControl' optional behavior more consistent
 * fixed buttongroup so that it won't toggle first item when there is no active item binding

### Cleanups
 * Cleaned up fake response in test mode
 * Cleaned up log messages.
 * Renamed 'vm' within graphobvservable to be 'node' to reflect the reality that it may be attached to other things (like views)
 * Cleaned up _ob usage in viewmodel and list
 * Fixed list.length bug in which it was firing removed before adjusting the length


## 1.1

### Enhancements

 * Multiple views per view model via new 'viewMode' view property
 * Ability to set/replace sub-models entirely using normal 'set' syntax (with automatic de-linking/linking of observer patterns)
 * Focus (activeTab and activeItem) bindings for tabs and cards
 * Two-way row grid selection binding (previously one-way)
 * Bindings for panel buttons, rbar, and lbar
 * Updated activator list with external "focus property" to keep flat and in-line with GluJS conventions
 
 
### Bug Fixes
 * Fixed issue with spinnerfield spin up/down arrows not binding
 * Fixed bug with bindings failing when using advanced transformers that modify the entire config bloc
