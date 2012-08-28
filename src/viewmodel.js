/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.Viewmodel
 * The view model is the "common sense" representation of application state and behavior. A 'root' view model represents
 * the application as a whole (or the module if you are a sub-app within a 'portal'), while other view models represent
 * various screens (tabs, etc.) or areas of a screen.
 * ##Defining and creating a view model
 *
 * A view model can be defined and instantiated on the fly from within a view model :
 *      var model = this.model ({
 *          status: 'OK'
 *      });
 *      //or for a dialog
 *      this.open ({
 *          status: 'OK'
 *      });
 * or it can be defined first (with namespace) and then referenced later through the 'mtype' property (as long
 * as you are in the same namespace):
 *      glu.defModel('example.main', {
 *          status : 'OK'
 *      });
 *      var vm = this.model ({
 *          mtype : 'main'
 *      });
 *
 * A view model can also be defined 'inline' within a containing view model using an 'mtype' property of 'viewmodel'
 *      glu.defModel('example.main', {
 *          detail : {
 *              mtype : 'viewmodel',
 *              myProp : 'A'
 *          }
 *      });
 *
 * or simply by reference
 *      glu.defModel('example.subscreen', {
 *          myProp : 'A'
 *      });
 *      glu.defModel('example.main', {
 *          detail : {
 *              mtype : 'subscreen'
 *          }
 *      });
 *
 * Referenced view models are fully parameterizable, so you can initialize any of the values with overrides:
 *      glu.defModel('example.main', {
 *          status : 'OK'
 *      });
 *      //...later...
 *      var vm = this.model({
 *          mtype : 'main',
 *          status : 'BAD'
 *      );
 *
 * A 'root' view model can be instantiated by one of several entry points, but most typically by setting it as the 'app':
 *      glu.app('example.main');
 * or
 *      glu.app({
 *          mtype :'example.main',
 *          //optional parameters...
 *      });
 * or it can be included as a subpanel of an already existing application panel:
 *      //...
 *      items : [{
 *          xtype: 'glupanel',
 *          viewmodelConfig : {
 *              mtype : 'main',
 *              //optional parameters...
 *          }
 *      }],
 *      //...
 * or (usually just for testing) you can start one with a fully qualified namespace
 *      var vm = glu.model('example.main');
 *
 * ## View model parts
 * The view model is composed of several distinct parts that represent your application state and behavior:
 *
 * *    Properties: Hold states that various parts of the screen can be in. Usually correspond to things that the user can set
 *      (like the contents of a text field, or the currently active tab, or which rows of a grid are selected).
 * *    Formulas: Calculated properties that respond to changes in properties or other formulas. By their nature, they are
 *      read-only so they typically represent the app 'responding' to user interaction. Glu will analyze the formula and keep it
 *      updated when input properties change.
 * *    Submodels: Contains various subscreens and lists of subscreens (glu is for full applications so view models are always
 *      in a hierarchy with a single root). There is also a special 'parentVM' property to find any view model's container.
 * *    Commands: Actions that the user can take that aren't represented by simple properties. For instance, a save button or
 *      hitting the 'close window' indicator.
 * *    Reactors: Rules that are triggered on property / formula changes so you don't have to put all of your side-effects
 *      into the property setter. For instance, refreshing the grid when any of several filters change. A formula is really a
 *      special type of reactor where the action is setting a single property; if it's more complicated, use a reactor.
 *
 *
 * ## Example
 *      glu.model({
 *          //PROPERTIES
 *          classroomName : 'Science',
 *          status : 'OK',
 *
 *          //FORMULAS
 *          classroomNameIsValid : function() { return this.classroomName !== '';}
 *          statusIsEnabled : function(){ return this.classroomNameIsValid;}
 *
 *          //SUBMODELS
 *          students : {
 *              mtype : 'list'
 *              items : [{
 *                  mtype : 'student',
 *                  firstName : 'Mike'
 *              }]
 *          }
 *
 *          //COMMANDS
 *          clear : function() {
 *              this.set('firstName','');
 *              this.set('status','OK');
 *          }
 *
 *          //REACTORS
 *          when_status_is_not_ok_then_fetch_problem_detail : {
 *              on : ['statusChanged'],
 *              action : function() {
 *                  if (this.status!=='OK'){
 *                      //fetch problem detail
 *                  }
 *              }
 *          }
 *      });
 *
 * ## Properties
 * Properties are declared simply by adding a property to the config object. The initial value will be whatever is provided.
 *      foo : 'we are foo'
 * Properties are accessed through the 'get' and 'set' methods. You can also read properties by simply reading the backing property directly:
 *      this.foo
 * As long as the property is bound or a reactive formulas, the value will always be current with UI state so a getter
 * is not strictly necessary. It is a matter of preference whether you access the property directly or call
 *      get ('foo')
 * to keep the get behavior encapsulated within the viewmodel.
 * To change get/set behavior (not usually recommended), you can manually add get/set overrides by using the convention:
 *      getFoo : function(){ return...}
 *      setFoo : function(value) {
 *         this.setRaw('foo',value);
 *      }
 * Calls to get() and set() will honor these overrides.
 *
 * In the future, we may provide either automatic getter/setters [getFoo() / setFoo('value')] and/or
 * Knockout-style getters/setters [foo()/foo('value')] if there is demand (we have experimented with both but always fallen back
 * to our old ways)
 *
 * ## Formulas
 * Formulas are read-only properties that respond to changes in other properties. To declare a formula, put a '$' at
 * the end of the name (this won't become part of its name but is just a flag) and then supply a function that returns
 * a value:
 *      saveIsEnabled$: function(){return this.isValid && this.isDirty;}
 * GluJS will scan the function and find property change events to listen for and so will automatically keep up to date with a minimum
 * of recalculation. In the example above,
 * if (and only if) the 'isValid' or 'isDirty' properties change, it will update the value of 'saveIsEnabled'.
 * Formulas can also be chained: in the example above both 'isValid' and 'isDirty' are actually other formulas!
 *
 * #### IsValid
 * There is one bit of magic-by-convention with formulas. If you name a formula such that it ends with 'IsValid', it will automatically
 * contribute to a global 'isValid' property on the view model. When all such formulas return true, then the global 'isValid' will
 * also be true.
 *
 * ## Submodels
 *
 * GluJS is a framework for quickly developing real applications with complex navigation and screens. Very often you'll want to split your
 * view models in parts. The initial example above has a list of 'student' view models. This list could correspond on the screen to
 * a set of items in a mobile list or a set of tabs. This is just one of the built-in UI composition patterns within gluJS.
 * Submodels are indicated by using the 'mtype' property within a nested object.
 *
 * ## Commands
 *
 * Whenever the user needs to take an action that isn't necessarily as simple as updating a property - especially when it involves
 * an Ajax call - then that is a command.
 * Typical commands are 'save', 'refresh', etc. They are declared simply by providing a function:
 *      save : function(){
 *          //...
 *      }
 * Very often, behavior that could be a command can really be expressed as properties. For instance, the
 * 'collapse' button on a panel could be a 'collapse' command. But it also could be more simply
 * modeled by a property:
 *      detailIsExpanded : true
 * Now you can get both collapse and expand in a single property and a single binding - and you have some state you can use
 * for other behavior (like in a formula).
 * Whenever possible, see if what you're trying to do can be reduced to a property and go with that.
 *
 * ## Reactors
 *
 * The reactor pattern is simply a shortcut to managing "event observers". It's a powerful way to reduce code clutter and break
 * out different UI behavior as "rules". For instance, if you want to refresh the grid whenever any one of five different properties
 * change, you could call 'refreshgrid' in each of those property setters. Or, you could simply state the following:
 *      When_a_grid_related_property_changes_Then_refresh_grid : {
 *          on : ['propertyAChanged','propertyBChanged','propertyCChanged','propertyDChanged','propertyEChanged'],
 *          action : function(){
 *              this.refreshStudents();
 *          }
 *      }
 * Later when you realize that you'd like to load only on an explicit refresh or just need to temporarily suppress the behavior for
 * debugging, you can just comment it out and "switch off" the behavior in one place.
 * While this is an entirely optional pattern, it is a natural and powerful fit for building reactive UIs.
 *
 * ## Convenience methods
 *
 * There are a number of convenience methods that are commonly used within a view model. Use them
 * instead of the matching ones on the 'glu' object because they
 * *    pass in the local namespace
 * *    set the scope of any callback to the viewmodel (so 'this' always refers to the view model)
 * *    automatically create parent/child associations where appropriate
 * *    are automatically mocked as needed by the simulation/testing framework just on that view model without breaking core 'glu' for other view models.
 *
 * The methods are as follows:
 *
 * *   localize
 * *   confirm
 * *   message
 * *   open
 * *   ajax
 * *   model
 */
glu.Viewmodel = glu.extend(Object, {

    constructor:function (config) {
        glu.log.debug('BEGIN viewmodel construction');
        glu.Viewmodel.superclass.constructor.call(this);
        glu.deepApply(this, config);
        this._private = this._private || {};
        this._private.setters = {};
        this._private.meta = {};
        //TO DO - separate between formulas and reactors proper...
        this._private.reactors = [];
        this._private.data = this._private.data || {};
        this._private.observable = new glu.GraphObservable({vm:this});
        this._private.viewmodelName = config.viewmodelName;
        this._private.children = [];

        //A view model either always has a parent or is the root. It has a parent even if "disconnected".
        //so need a different way to register disconnection than being null
        this.rootVM = this.parentVM ? this.parentVM.rootVM : this;

        delete config.viewmodelName;

        this.init = config.init || function () {
            this.initChildren();
        };
        this.activate = config.activate || function () {
        };
        this.deactivate = config.deactivate || function () {
        };
        this.close = config.close || this.doClose;

        //run a custom onCreate if it exists
        if (config.onCreate) {
            config.onCreate.call(this);
        }
        //build sub models, generate setters/getters and wire event listeners
        this._walkConfig();

        //set all reactors...
        for (var i = 0; i < this._private.reactors.length; i++) {
            var reactor = this._private.reactors[i];
            if (reactor.init) reactor.init();
        }
        this._private.isInstantiated = true;
        if (glu.testMode) {
            this.message = jasmine.createSpy('message');
            this.confirm = jasmine.createSpy('confirm');
            var me = this;
            this.confirm.respond = function(btn) {
                //TODO: Respond to confirmations in order in case they have stacked.
                var next = me.confirm.mostRecentCall;
                if (next === undefined || next.args === undefined || next.args.length === 0) {
                    throw "A confirmation was not requested"
                }
                next.args[0].fn.call(me,btn);
            };
        }
        glu.log.debug('END viewmodel construction');
    },

    /**
     * Performs the underlying close operation on this view model. Of course this only makes sense where the viewmodel
     * corresponds to either a floating dialog, a screen on a mobile stack, or an item in a container (tabpanel, card, etc.)
     */
    doClose:function () {
        if (this.parentList) {
            this.parentList.remove(this);
        }
        this.fireEvent('closed', this);
    },

    /**
     * Returns the value of a property.
     * @param propName
     * @return {*}
     */
    get:function (propName) { //TODO: Use base model implementaiton
        return this.getRaw(propName);
    },

    /**
     * Sets the value of a property. If there is a custom setter defined, it will use that instead.
     * @param propName
     * @param value
     */
    set:function (propName, value) {
        var setter = this._private.setters[propName];
        if (setter === undefined) {
            throw 'Cannot set: This view model has no property named ' + propName;
            // this.makePropertyAccessors(propName);
            // customSetter = this[customSetterName];
        }
        setter.call(this, value);
    },
    /**
     * Sets the raw value of a property and bypasses any custom setter. This is usually used within
     * the custom setter itself to set the underlying property after any preprocessing.
     * @param propName
     * @param value
     */
    setRaw:function (propName, value) {
        var subModel = this._private.meta[propName].isChildModel === true;
        if (subModel) {
            this._ob.detach(propName);
        }
        var oldValue = this.get(propName);
        if (glu.equivalent(oldValue, value)) {
            return; //do nothing if it's the same thing.
        }
        this._private.data[propName] = value;
        if (!glu.isFunction(this[propName])) { //if not in "knockout" mode
            this[propName] = value;
        }
        this.fireEvent(propName + 'Changed', value, oldValue, {
            modelPropName:propName
        });
        if (subModel) {
            this._ob.attach(propName);
        }
        // this.fireEvent('changed', value, oldValue, {
        // modelPropName : propName
        // });
    },
    getRaw:function (propName) {
        if (this._private.data.hasOwnProperty(propName)) {
            return this._private.data[propName];
        }
        return this[propName];
    },

    getPropertyInfo :function(propName){
        var value = this.get(propName);
        var type = glu.getDataTypeOf(value);
        return {
            name : propName,
            type : type
        }
    },

    /**
     * Adds a listener for a view model event with a default scope of the view model itself
     * The formula and reactor patterns (see above) means there is little reason to use this directly within a viewmodel.
     * @param eventName
     * @param handler
     * @param scope
     */
    on:function (eventName, handler, scope) {
        scope = scope || this;
        this._private.observable.on(eventName, handler, scope);
    },

    /**
     * Fires off an event to any observers.
     * There is usually little reason to call this directly, unless you are doing a broadcast pattern to children
     * in which some of them may opt in and others don't. In other cases (and within the viewmodel), it is usually
     * better just to invoke methods directly for clarity.
     */
    fireEvent:function () {
        glu.log.info('Viewmodel "' + this.referenceName + '" is firing event "' + arguments[0] + '""');
        this._private.observable.fireEvent.apply(this._private.observable, arguments);
    },

    _walkConfig:function () {
        var propNames = [];
        for (var propName in this) {
            propNames.push(propName);
        }
        for (var i = 0; i < propNames.length; i++) {
            var propName = propNames[i];
            if (this.hasOwnProperty(propName)) {
                this._processConfigProperty(propName);
            }
        }
    },

    _processConfigProperty:function (propName, propValue) {
        //ignore reserved words...
        if (propName === '_private' || propName === 'requiresTrait' || propName === 'set' ||
            propName === 'get' || propName === 'referenceName' || propName === 'viewmodelName' ||
            propName === 'ns' || propName === 'mtype' || propName === 'parentList' ||
            propName === 'rootVM' || propName === glu.conventions.parentProperty ) {
            return;
        }
        propValue = propValue || this[propName];

        if (glu.isFunction(propValue) && propName.substring(0, 2) == 'on' && propName.substring(2, 3).toUpperCase() == propName.substring(2, 3)) {
            //switch to being a rule
            var action = propValue;
            propValue = {
                on:propName.substring(2),
                action:action
            };
        }
        if (glu.isFunction(propValue) && propName.match(/\$$/)) {
            //switch to being a formula
            propName = propName.substring(0,propName.length - 1);
            propValue = {
                on : '$',
                formula:propValue
            };
        }

        if (glu.isFunction(propValue)) {
            //a regular action - no need for further processing.
            return;
        }

        if (glu.isObject(propValue) && glu.Reactor.is(propValue)) {
            //REACTOR!
            if (propValue.formula && propName.match(/IsValid$/)) {
                //We automatically make a global 'isValid' if you introduce anything ending in IsValid
                this._processValidator(propName, propValue);
            }
            if (propValue.formula) {
                glu.log.debug("Building formula " + propName);
            } else {
                glu.log.debug("Building reaction " + propName);
            }
            this._private.reactors.push(glu.Reactor.build(propName, propValue, this));
        }

        if (glu.isObject(propValue) && propValue.hasOwnProperty('mtype')) {
            //SUBMODEL!
            propValue.referenceName = propName;
            this._private.children.push(propName);
            var model = this.model(propValue);
            propValue = model;
            this[propName] = propValue;
            //attach (so that it doesn't matter what order the graph was built up in...
            this._ob.attach(propName,model,"parentVM");
            this.makePropertyAccessors(propName,propValue,true);
            return;
        }

        //a regular property with either a value or an non-model sub-object
        glu.log.debug('Adding setter/getter for "' + propName + '"');

        this.makePropertyAccessors(propName, propValue);
    },

    _processValidator:function (propName, propValue) {
        var formula = propValue.formula;
        var me = this;
        function updateGlobalValidity (newVal) {
            var valid = newVal;
            var actual = valid;
            if (glu.isString(valid)) { //strings mark it as invalid
                valid = false;
            }
            var oldValid = me._private.validMap.hasOwnProperty(propName) ? me._private.validMap[propName] : true;
            if (oldValid && !valid) {
                me._private.invalidCount++;
            }
            if (!oldValid && valid) {
                me._private.invalidCount--;
            }
            me._private.validMap[propName] = valid;
            me.setRaw('isValid', me._private.invalidCount == 0);
            return actual;
        };
        this.on (propName+'Changed',function(newVal){
            updateGlobalValidity(newVal);
        },this);
        this._private.hasValidators = true;
        this._private.validMap = this._private.validMap || {};
        this._private.invalidCount = 0;
        this.isValid = true;
        this.makePropertyAccessors('isValid', true);
    },

    makePropertyAccessors:function (propName, initialValue, isChildModel) {
        this._private.data[propName] = initialValue;
        var me = this;
        var setter = this['set' + glu.string(propName).toPascalCase()] ||
            function (value) {
                me.setRaw(propName, value, isChildModel);
            };
        this._private.setters[propName] = setter;
        this._private.meta[propName] = {
            setter : setter,
            isChildModel: isChildModel
        };
        if (false) //TODO: Test for knockout mode
        {
            /*
             * create a special function that calls the setter if a value is
             * passed in, but otherwise returns the getter
             * knockout-style has the advantage of some better "intellisense"
             * but has the disadvantage of making the bind syntax different than
             * javascript access.
             * Example:
             *     Bind:    '@{detail.ssn}'
             *  Concise: this.detail.ssn
             *  KO:         this.detail().ssn()
             *  Safe:    this.detail.get('ssn')
             */

            this[propName] = function () {
                if (arguments.length === 0) {
                    return this.get(propName);
                }
                setter(arguments[0]);
            }
        } else {
            this[propName] = initialValue;
        }
    },

    registerControlBinding:function (modelPropName, control) {
        if (!glu.testMode) {
            return;
        }
        this._private.controlBindings = this._private.controlBindings || {};
        if (!this._private.controlBindings[modelPropName]) {
            this._private.controlBindings[modelPropName] = [];
        }
        this._private.controlBindings[modelPropName].push(control);
    },

    //convenience methods for use by the view models themselves
    /**
     * Creates a new child model for this view model. The child model will not affect any screen behavior until
     * it is added to a list that is bound to a view that displays child components. For instance, to add a new student
     * tab you could do the following:
     *      addStudentScreen : function(id) {
     *          var student = this.model ({mtype:'student', id:di});
     *          student.init(); //load the backing data
     *          this.studentScreens.add(student);
     *      }
     * @param config
     * @return {*}
     */
    model:function (config) {
        config.ns = this.ns;
        config.parentVM = this;
        config.rootVM = this.rootVM;
        return glu.model(config);
    },

    /**
     * Localizes based on the provided lookup key.
     * The view model will be passed in and the default localizer will look for the key in a matching locale namespace
     * first and then go to the root. So for a viewmodel called 'student' and a key called 'grade', both of these would work:
     *      example.locale = {
     *          grade : 'Student Grade'
     *      };
     *      example.locale = {
     *          student : {
     *              grade : 'Student Grade'
     *          }
     *      };
     * Localization keys can also include substitution parameters. If a parameter set is not included in the call, it will be
     * provided off of the view model. So if there was a 'firstName' on the view model, this shortcut would work:
     *      example.locale = {
     *          grade : 'Student Grade for {firstName} {lastName}'
     *      }
     * The default localizer can be overridden with a call to glu.setLocalizer if the localization pattern is already
     * set in stone on an existing project.
     * @param key
     * The look up key
     * @param params
     * The values to be used when substituting within the locale string
     * @return {*}
     */
    localize:function (key, params) {
        return glu.localize({viewmodel:this, key:key, params:params});
    },

    /**
     * Shortcut for a confirmation dialog with a callback.
     * The scope of the callback will be the view model.
     * In test mode will be replaced with a jasmine spy with an additional function called respond
     * so that you can simulate a response. Simply return the name of the button that you want to be simulated:
     *      vm.confirm.respond('ok')
     * @param title
     * @param message
     * @param fn
     * @param scope
     * @return {*}
     */
    confirm:function (title, message, fn, scope) {
        if (glu.isObject(title)) {
            title.scope = title.scope || this;
        }
        scope = scope || this;
        return glu.confirm(title, message, fn, scope);
    },

    /**
     * Shortcut for a quick message dialog.
     * In test mode will be replaced with a jasmine spy.
     * @param title
     * @param message
     * @param fn
     * @param scope
     * @return {*}
     */
    message:function (title, message, fn, scope) {
        if (glu.isObject(title)) {
            title.scope = title.scope || this;
        }
        scope = scope || this;
        return glu.message(title, message, fn, scope);
    },

    /**
     * Opens a view model as a popup (usually modal) dialog or pushes a screen on to a mobile navigation stack.
     * @param config
     * A normal config block that you would pass into glu.model, only in this case it also displays the view model in a window.
     * In test mode it instantiates the new view model but does not instantiate the view.
     * @return {*}
     */
    open:function (config) {
        config.ns = config.ns || this.ns;
        config.parentVM = config.parentVM || this;
        var win = glu.openWindow(config);
        return win._bindings.viewmodel;
    },

    /**
     * Makes a normal Ajax call through the underlying ajax provider. The scope is automatically set to the view model.
     * @param config
     */
    ajax:function (config) {
        glu.apply(config, {scope:this});
        Ext.Ajax.request(config);
    },

    initChildren : function(){
        for (var i =0;i<this._private.children.length;i++){
            var child = this[this._private.children[i]];
            if(!glu.isFunction(child.init))continue;
            child.init();
        }
    },

    commitBulkUpdate : function(){
        this.fireEvent('bulkupdatecommitted',this);
    },
	
	unParent: function(){
		this._ob.detach('parentVM');
		delete this.parentVM;
	}

});
glu.mreg('viewmodel', glu.Viewmodel);
