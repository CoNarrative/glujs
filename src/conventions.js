/*
 * Copyright (C) 2012 by CoNarrative
 */

if (window.glu === undefined) {
    glu = {}
}
glu.conventions = {
    localizeStart:'~~',
    localizeEnd:'~~',
    localeNs:'locale',
    bindingSymbol:'@',
    /* DOCS DISABLED FOR NOW
     * <p>The start delimiter to identify view model replacement variables in a view spec.</p>
     * <p>The default value is<div class="mdetail-params">@{</div>
     *  @type String
     */
    startDelimiter:'{',
    /* DOCS DISABLED FOR NOW
     * <p>The end delimiter to identify view model replacement variables in a view spec.</p>
     * <p>The default value is<div class="mdetail-params">}</div>
     *  @type String
     */
    endDelimiter:'}',
    autoUp:'..',
    not:'!',
    windowPath:'/',
    parentProperty:'parentVM',

    specSuffix:'',
    viewmodelNs:'viewmodels',
    viewNs:'views',
    lookupNs:'lookups',

    bindProp:function (propname) {
        return this.expression(propname);
    },

    asLocaleKey : function(propName) {
        return this.localizeStart + propName + this.localizeEnd;
    },

    expression:function (propname, options) {
        if (!options) {
            return this.bindingSymbol + this.startDelimiter + propname + this.endDelimiter;
        }
        var str = this.bindingSymbol;
        if (options.optional) {
            str = str + '?';
        }
        if (options.onetime) {
            str = str + '1';
        }
        str = str + this.startDelimiter;
        if (options.not) {
            str = str + this.not;
        }
        if (options.root) {
            str = str + this.windowPath;
        }
        if (options.up) {
            str = str + this.autoUp
        }
        return str + propname + this.endDelimiter;
    },

    build:function () {
        var expr = glu.conventions.bindingSymbol;
        return {
            start:function () {
                expr += glu.conventions.startDelimiter;
                return this;
            },
            root:function () {
                expr += glu.conventions.windowPath;
                return this;
            },
            allUp:function () {
                expr += glu.conventions.autoUp;
                return this;
            },
            up:function () {
                expr += glu.conventions.parentProperty;
                return this;
            },
            prop:function (prop) {
                expr += '.' + prop;
                return this;
            },
            lookupNs:function () {
                expr += '.' + glu.conventions.lookupNs;
                return this;
            },
            literal:function (lit) {
                expr += lit;
                return this;
            },
            dot:function () {
                expr += '.';
                return this;
            },
            end:function () {
                return expr + glu.conventions.endDelimiter;
            }
        }
    }

};

// register bindingConventions
glu.regBindingDirective('onetime', {
    symbols:['onetime', '1'],
    onetime:true,
    oneway:true,
    toModel:false,
    toControl:true
});

glu.regBindingDirective('twoway', {
    symbols:['twoway', '<>'],
    onetime:false,
    oneway:false,
    toModel:true,
    toControl:true
});

glu.regBindingDirective('tocontrol', {
    symbols:['tocontrol', '>'],
    onetime:false,
    oneway:true,
    toModel:false,
    toControl:true
});

glu.regBindingDirective('optional', {
    symbols:['optional', '?'],
    optional:true,
    toModel:true,
    toControl:true
});


