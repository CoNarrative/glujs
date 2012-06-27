/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.extjs.adapters.button
 * @author Mike Gai
 * @extends glu.extjs.adapters.component
 *
 * A button most commonly invokes a command within glu. For example:
 *      glu.ns('sample').main = {
 *          go : function () {
 *              //...
 *          }
 *      };
 *      glu.ns('sample').main = {
 *          tbar : [{
 *              text : 'Go',
 *              handler : '@{go}'
 *          }
 * will invoked the 'go' command.
 *
 * However, a button within a glu.extjs.ux.ButtonGroup can also set a value:
 *      glu.ns('sample').main = {
 *          mode : 'road'
 *      };
 *      glu.ns('sample').main = {
 *          tbar : {
 *              xtype : 'buttongroup',
 *              items: [{
 *                  text : 'Satellite',
 *                  value : '@{satellite}'
 *               },{
 *                  text : 'Hybrid',
 *                  value : '@{hybrid}'
 *              },{
 *                  text : 'Road',
 *                  value : '@{road}'
 *              }]
 *          }
 *      }
 *
 * The last button will start off selected, and clicking the buttons will change the value of *mode*.
 * In either case, name convention binding can be used as a shortcut:
 *      items : ['satellite','hybrid','road']
 * is equivalent to the last example (the name will be passed as a key to the configured localizer for rendering).
 *
 */
glu.regAdapter('button', {
    extend : 'component',
    defaultTypes : {
        menu : 'menu'
    },
    isChildObject : function(propName){
        return propName==='menu';
    },

    menuShortcut : function(value) {
        return {
            xtype:'menu',
            defaultType:'menuitem',
            items:value
        };
    },
    /**
     * @cfg {Function} handler
     * *one-time binding.* The (command) handler for this button.
     * Like all bound glu listeners, it passes in the default arguments of the triggering event,
     * prepended by any value you might have assigned to the control. For instance, consider the following:
     *      glu.ns('sample').main = {
     *          openScreen : function (screenTag) {
     *              //...
     *          }
     *      };
     *      glu.ns('sample').main = {
     *          tbar : [{
     *              text : 'Open Major',
     *              value : 'major',
     *              handler : '@{openScreen}'
     *          },{
     *              text : 'Open Minor',
     *              value : 'minor',
     *              handler : '@{openScreen}'
     *          }]
     *      }
     * Pressing the 'minor' button will pass the value 'minor' into the openScreen command function.
     *
     * **Convention: ** @{..*start*}
     */

    applyConventions: function(config, viewmodel) {
        Ext.applyIf (config, {
            handler : glu.conventions.expression(config.name,{up:true}),
            pressed : glu.conventions.expression(config.name + 'IsPressed', {optional:true}),
            text : glu.conventions.asLocaleKey(config.name)
        });
        glu.provider.adapters.Component.prototype.applyConventions.apply(this, arguments);
    },

    /**
     * @cfg {String} text
     * The text to display on the button.
     *
     * It is usually best to let this be handled by localization:
     *
     *      text : '~~firstName~~'
     *
     * **Convention: ** &#126;&#126;*firstName*&#126;&#126;
     */
    /**
     * @cfg {Boolean} pressed
     * *two-way binding.* The pressed state of this button if a toggle button.
     *
     * **Convention: ** @?{debugIsPressed}
     */
    pressedBindings:{
        setComponentProperty:function (newValue, oldValue, options, control) {
            control.toggle(newValue, true);
        },
        eventName:'toggle',
        eventConverter:function (control) {
            return control.pressed;
        }
    }

});