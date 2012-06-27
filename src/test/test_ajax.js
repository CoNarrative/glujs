/*
 * Copyright (C) 2012 by CoNarrative
 */
Ext.ns('glu.test.ajax');
glu.test.ajax.originalProvider = (Ext.getVersion().major > 3 || Ext.getProvider().provider == 'touch') ? Ext.Ajax.request : Ext.lib.Ajax.request;

/**
 * @class glu.test
 * @singleton
 * Provides simulation facilities for specification-based testing
 */

/**
 * @param config  The backend configuration in the form:
 *   @param defaultRoot The root url to capture (that is, the root url of your JSON REST services). Often it is something like '/json'. Defaults to '/'
 *   @param fallbackToAjax When true, if an AJAX call is made to a route that is not captured by this back-end, go ahead and let it be handled normally by the AJAX library. When false, throw an exception.
 *   @param autoRespond Automatically fake the response (for "live simulation" mode with an actual user)
 *   @param routes The routes for capture
 * @return {Object}
 *
 * The route format is in the form
 *     'routename' : {
 *        url : 'foo/bar/:id',
 *        handle : function(req) { return {echoId: req.params.id};}
 *     }
 *
 * Example:
 *      backend = glu.test.createBackend({
 *          defaultRoot: '/json/',
 *          fallbackToAjax: auto,
 *          autoRespond: auto,
 *          routes: {
 *              'removeAssets': {
 *                  url: 'assets/action/remove',
 *                  handle: function(req) {
 *                      return assets.remove(req.params.ids);
 *                  }
 *              },
 *              'requestVerification': {
 *                  url: 'assets/action/requestVerification',
 *                  handle: function(req) {
 *                      return assets.update(req.params.ids, {status: 'verifying' });
 *                  }
 *              },
 *              'assetSave': {
 *                  url: 'assets/:id/action/save',
 *                  handle: function(req) {
 *                      return assets.replace(req.params.id, req.jsonData);
 *                  }
 *              },
 *              'assets': {
 *                  url: 'assets',
 *                  handle: function(req) {
 *                      return assets.list(req.params);
 *                  }
 *              },
 *              'asset': {
 *                  url: 'assets/:id',
 *                  handle: function(req) {
 *                      return assets.get(req.params.id);
 *                  }
 *              }
 *          }
 *      });
 *
 */
glu.test.createBackend = function (config) {
    /**
     * @class glu.test.Backend
     * A backend object for use with specification-style testing
     */
    var me = {
        fallbackToAjax:config.fallbackToAjax || false,
        defaultRoot:config.defaultRoot || '/',
        requests:[],
        routes:{},

        /**
         Start intercepting AJAX calls using this backend
         */
        capture:function () {
            if (Ext.getVersion().major > 3 || Ext.getProvider().provider == 'touch') {
                Ext.Ajax.request = this.ext4Request;
            } else {
                Ext.lib.Ajax.request = this.ext3LibRequest;
            }
        },
        captureUrl:function (url) {
            if (url.substring(0, 1) != '/') {
                url = me.defaultRoot + url;
            }
            var qsIndex = url.indexOf('?');
            if (qsIndex > -1) {
                //TODO: Process query string!!!
                var queryString = url.substring(url);
                url = url.substring(0, qsIndex);
            }
            return {
                url:url
            };
        },
        ext4Request:function (options) {
            var q = me.captureUrl(options.url);
            var url = q.url;
            var route = me.matchRoute(url);
            if (route === undefined) {
                if (me.fallbackToAjax) {
                    //perform actual Ajax
                    glu.test.ajax.originalProvider.call(this, options);
                    return;
                } else {
                    throw 'There is no matching back-end route for ' + url;
                }
            }
            var scope = options.scope || window;
            var requestOptions = this.setOptions(options, scope);
            if (this.fireEvent('beforerequest', this, options) !== false) {
                var xhr = {
                    headers:{},
                    setRequestHeader:function (key, header) {
                        this.headers[key] = header;
                    }
                };
                var headers = this.setupHeaders(xhr, options, requestOptions.data, requestOptions.params);
                var jsonParams = Ext.isString(options.params) ? Ext.decode(options.params) : options.params;
                var request = {
                    serviceName:route.name,
                    headers:headers,
                    params:Ext.applyIf(route.params, jsonParams),
                    cb:{
                        scope:scope,
                        success:options.success || Ext.emptyFn,
                        failure:options.failure || Ext.emptyFn,
                        callback:options.callback || Ext.emptyFn
                    },
                    url:options.url,
                    o:options
                };
                if (options.method != 'GET') {
                    request.jsonData = jsonParams;
                }
                route.requests.push(request);
                me.requests.push(request);
                if (config.autoRespond) {
                    setTimeout(function () {
                        me.respond(request)
                    }, 5); //respond back in 5 ms
                }
            } else {
                Ext.callback(options.callback, options.scope, [options, undefined, undefined]);
                return null;
            }
        },

        matchRoute:function (path) {
            for (var name in this.routes) {
                var route = this.routes[name];
                var captures;
                if (captures = route.regex.exec(path)) {
                    var keys = route.keys;
                    route.params = {};
                    // params from capture groups
                    for (var i = 1; i < captures.length; i++) {
                        var key = keys[i - 1];
                        var val = Ext.isString(captures[i]) ? decodeURIComponent(captures[i]) : captures[i];
                        if (key) {
                            route.params[key.name] = val;
                        }
                    }
                    return route;
                }
            }
        },

        ext3LibRequest:function (verb, actualUrl, cb, p, o) {
            var q = me.captureUrl(o.url);
            var url = q.url;
            var route = me.matchRoute(url);
            if (route === undefined) {
                if (me.fallbackToAjax) {
                    //perform actual Ajax
                    glu.test.ajax.originalProvider.call(this, verb, actualUrl, cb, p, o);
                    return;
                } else {
                    throw 'There is no matching back-end route for ' + url;
                }
            }
            var jsonParams = Ext.isString(o.params) ? Ext.decode(o.params) : o.params;
            var request = {
                serviceName:route.name,
                params:Ext.applyIf(route.params, jsonParams),
                cb:cb,
                url:o.url,
                o:o
            };
            route.requests.push(request);
            me.requests.push(request);
            if (config.autoRespond) {
                setTimeout(function () {
                    me.respond(request)
                }, 5); //respond back in 5 ms
            }
        },
        /**
         * Register a new route
         * @param config The route configuration in the form
         *      @param {String} name The name of the route
         *      @param {String} url The url of the route
         *      @param {Function} handle The handler for the route
         */
        register:function (config) {
            if (config.url.substring(0, 1) != '/') {
                config.url = this.defaultRoot + config.url;
            }
            var route = this.createRoute(config.verb || config.method, config.url, config.handle);
            route.name = config.name;
            route.handle = config.handle;
            this.routes[route.name] = route;
        },

        /**
         * Respond to a given request (will remove the request from the route's queue)
         * @param request The request to fulfill
         * @param [ajaxResponse] The response if overriding the default response
         */
        respond:function (request, ajaxResponse) {
            //pull off the two queues
            var sRequests = this.routes[request.serviceName].requests;
            for (var i = 0; i < sRequests.length; i++) {
                var toCheck = sRequests[i];
                if (request == toCheck) {
                    sRequests.splice(i, 1);
                    break;
                }
            }
            for (var i = 0; i < this.requests.length; i++) {
                var toCheck = this.requests[i];
                if (request == toCheck) {
                    this.requests.splice(i, 1);
                    break;
                }
            }
            var route = this.routes[request.serviceName];
            ajaxResponse = ajaxResponse || route.handle(request);
            if (!ajaxResponse.responseText && !ajaxResponse.responseObj) {
                ajaxResponse = {responseObj:ajaxResponse};
            }
            ajaxResponse.headers = ajaxResponse.headers || {};
            var keys = [];
            for (var key in ajaxResponse.headers) {
                keys.push(key);
            }
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                ajaxResponse.headers[key.toLowerCase()] = ajaxResponse.headers[key];
            }
            var responseText = ajaxResponse.responseText || Ext.encode(ajaxResponse.responseObj);
            var response = {
                //requestId : request.id,
                tId:request.o.tId,
                // Normalize the status and statusText when IE returns 1223, see the above link.
                status:200 || ajaxResponse.status,
                statusText:'OK' || ajaxResponse.statusText,
                getResponseHeader:function (header) {
                    return ajaxResponse.headers[header.toLowerCase()];
                },
                getAllResponseHeaders:function () {
                    return ajaxResponse.headers;
                },
                responseText:responseText,
                argument:request.cb.argument
            };
            //callback
            var success = (response.status >= 200 && response.status < 300) || response.status == 304;
            if (success) {
                request.cb.success.call(request.cb.scope, response);
            } else {
                request.cb.failure.call(request.cb.scope, response);
            }
            if (request.cb.callback) {
                request.cb.callback.call(request.cb.scope, request.o, success, response);
            }
        },
        /**
         * Respond to the first item in the routes queue
         * @param routeName The name of the route
         * @param [ajaxResponse] The response object if overriding the default response
         */
        respondTo:function (serviceName, ajaxResponse) {
            var route = this.routes[serviceName];
            if (!route) {
                throw "Unable to find a simulated route with the name '" + serviceName + "'";
            }
            if (route.requests.length == 0) {
                throw "Route '" + serviceName + "' does not have any pending requests to which we can respond."
            }
            this.respond(route.requests[0], ajaxResponse)
        },
        respondNext:function (ajaxResponse) {
            this.respond(this.requests[this.requests.length - 1], ajaxResponse);
        },
        /**
         * Returns the responses in the request queue for that route
         * @param routeName The name of the route
         * @return {Object} the request object
         */
        getRequestsFor:function (serviceName) {
            return this.routes[serviceName].requests
        },
        createRoute:function (method, path, options) {
            options = options || {};
            var keys = [];
            return {
                path:path,
                method:method,
                regex:this.regexifyRoute(path, keys),
                keys:keys,
                requests:[]
            };
        },
        regexifyRoute:function (path, keys, caseSensitive) {
            path = path.replace(/\//g, '\/');
            path = path.replace(/:\w+/g,
                    function (keyBlock) {
                        keys.push({
                            name:keyBlock.substring(1)
                        });
                        return '([^/]+.?)';
                    });
            return new RegExp('^' + path + '/?$', caseSensitive ? '' : 'i' );
        }

    };
    if (config.routes) {
        if (glu.isObject(config.routes)) {
            var routes = [];
            for (var key in config.routes) {
                var route = config.routes[key];
                route.name = key;
                routes.push(route);
            }
            config.routes = routes;
        }
        for (var i = 0; i < config.routes.length; i++) {
            var routeSpec = config.routes[i];
            me.register(routeSpec);
        }
    }
    return me;
};
