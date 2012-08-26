/*
 * Copyright (C) 2012 by CoNarrative
 */
glu.Reactor = {
    is:function (obj) {
        return obj.hasOwnProperty('on') && (obj.hasOwnProperty('action') || obj.hasOwnProperty('formula'));
    },
    build:function (propName, reactor, vmOfReactor, scope) {
        scope = scope || vmOfReactor;
        var isFormula = reactor.hasOwnProperty('formula');
        var formula = reactor.formula;
        var evts = reactor.on || [];
        if (evts === '$') {
            //auto-detect through introspection
            var code = formula.toString();
            var thisMatchesRe = /this\.([\.\w]*)/g;
            var getMatchesRe = /this\.get\s*\(\s*[\'\"]([\w\.]*)/g;
            var toWatch = {};
            var matches;
            function find(regex) {
                while (matches = regex.exec(code)) {
                    var prop = matches[1];
                    if (prop === 'get' || prop === 'localize') continue;
                    toWatch[prop+'Changed'] = true;
//                    var tokens = prop.split('\.');
//                    var lastProp='';
//                    for (var i =0 ;i<tokens.length; i++){
//                        toWatch[lastProp + tokens[i] + 'Changed'] = true;
//                        lastProp = lastProp + tokens[i] + '.';
//                    }
                }
            }
            find (thisMatchesRe);
            find (getMatchesRe);

            evts = [];
            reactor.on = evts;
            for (var evt in toWatch) {
                evts.push(evt);
            }
        }
        if (glu.isString(evts)) {
            evts = [evts];
        }
        if (isFormula) {
            //establish setter
            if (vmOfReactor.makePropertyAccessors){
                vmOfReactor.makePropertyAccessors(propName);
            }
            reactor.init = function () {
                vmOfReactor.setRaw(propName, formula.apply(scope)); //set silently
            }
        }
        var action = isFormula ?
            function () {
                // calculate formula
                var value = formula.apply(scope);
                // TODO: Normalize 'reactor' on an array of things -> action across everything
                vmOfReactor.setRaw(propName, value);
            }
            : reactor.action;


        for (var i = 0; i < evts.length; i++) {
            var eventName = evts[i];
            var fullEventName = eventName;
            if (i>0)             console.log('---------------------------------' + fullEventName);
            var thisVm = vmOfReactor;
            var tokens = eventName.split(/[\$\.]/);
            for (var tidx = 0; tidx < tokens.length - 1; tidx++) {
                //walk association graph
                thisVm = thisVm[tokens[tidx]];
                if (thisVm===undefined) {
                    throw glu.string('Could not find association "{0}" along path {1}').format(tokens[tidx], eventName);
                }
            }
           //the actual listening *disregards* the walking going on above and just treats that as a validation...
            if (vmOfReactor.on) {
                vmOfReactor.on(fullEventName, action, vmOfReactor, true);
            }
        }
        return reactor;
    }
};