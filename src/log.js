/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.log = function () {
    glu.logLevel = glu.logLevel || 'info';
    if (Ext.isIE) {
        glu.logLevel = 'off';
    }
    var levels = {
        off:0,
        error:10,
        warn:20,
        info:30,
        debug:40
    };
    var empty = function () {
    };
    var level = levels[glu.logLevel] || 0;
    return {
        /**
         * Logs an info message
         * @param {String} str The log message
         */
        info:level >= 30 ? function (str) {
            console.log('INFO:  ' + str);
        } : empty,
        warn:level >= 20 ? function (str) {
            console.log('WARN:  ' + str);
        } : empty,
        error:level >= 10 ? function (str) {
            console.log('ERROR:  ' + str);
        } : empty,
        debug:level >= 40 ? function (str) {
            console.log('DEBUG:  ' + str);
        } : empty,
        indents:0,
        indent:'',
        indentMore:function () {
            this.indents++;
            this.indent = (new Array(this.indents)).join('   ');
        },
        indentLess:function () {
            this.indents--;
            if (this.indents < 0) this.indents = 0;
            this.indent = (new Array(this.indents)).join('   ');
        }
    }
}();




