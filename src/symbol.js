/*
 * Copyright (C) 2012 by CoNarrative
 */
/**
 * @class glu.Symbol
 * Provides utilities for manipulating symbols to help with naming conventions
 *
 */

glu = window.glu || {};
glu.Symbol = function (str) {
    this.str = str;
}
glu.symbol = function (str) {
    return new glu.Symbol(str);
}
glu.string = glu.symbol;

glu.apply(glu.Symbol.prototype, {
    /**
     * Determins if a string ends with the provided suffix
     * @param {String} suffix The suffix to check with
     * @return {Boolean}
     */
    endsWith:function (suffix) {
        if (!this.str) {
            return this.str;
        }
        return this.str.indexOf(suffix, this.str.length - suffix.length) !== -1;
    },

    /**
     * Converts a string to camel case
     * @return {String}
     */
    toCamelCase:function () {
        if (!this.str) {
            return this.str;
        }
        return this.str.substring(0, 1).toLowerCase() + this.str.substring(1);
    },

    /**
     * Converts a string to pascal case
     * @return {String}
     */
    toPascalCase:function () {
        if (!this.str) {
            return this.str;
        }
        return this.str.substring(0, 1).toUpperCase() + this.str.substring(1);
    },
    /*
     * return the symbol up until it hits some flag word
     */
    until:function (remove) {
        var target = glu.symbol(remove).toPascalCase();
        var trimAt = this.str.indexOf(target);
        return trimAt == -1 ? this.str : this.str.substring(0, trimAt);
    },
    /**
     * returns symbols split on case
     */
    split:function () {
        var name = this.str.replace(/([A-Z])/g, function (g) {
            return '@' + g
        });
        return name.split('@');
    },
    /**
     * Injects a space before upper case letters excluding the first letter in the string.
     * @return {String}
     */
    asTitle:function () {
        var name = this.str.replace(/([A-Z])/g, function (g) {
            return ' ' + g.toUpperCase();
        });
        if (name.indexOf(' ') == 0) {
            name = name.substring(1);
        }
        return glu.string(name).toPascalCase();
    },

    /**
     * Accepts either a set of arguments that represent values to substitute ordinally
     * or one or more config objects in which to search by name key
     * @param cfg
     * @return {*}
     */
    format:function (cfg) {
        var args = arguments;
        if (!glu.isObject(cfg)) {
            return this.str.replace(/{(\d+)}/g, function (token, idx) {
                var key = Number(token.substring(1, token.length - 1));
                if (args[key] === undefined) {
                    throw "Positional parameter " + token + " is out of range for this string substitution.";
                }
                return args[idx];
            });
        }
        //otherwise name based substitutions...
        return this.str.replace(/{([\.\w]*?)}/g, function (token) {
            var key = token.substring(1, token.length - 1);
            var value = undefined;
            for (var i = 0; i < args.length; i++) {
                value = glu.walk(key, args[i]);
                if (value !== undefined) {
                    break;
                }
            }
            if (value === undefined) {
                throw "Need to supply value for named parameter " + key + " for this string substitution.";
            }
            return value;
        });

    }
});


