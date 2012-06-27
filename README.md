#@{GluJS}
*A framework for rapid development of enterprise-ready reactive web & mobile applications "to spec"*

GluJS is a framework for the test-driven development of reactive applications
leveraging rich javascript widget libraries.

Currently we have adapters with basic support for Ext JS 3.1+ and Ext JS 4.06+, an experimental adapter
for Sencha Touch and we'll soon be doing Titanium.

##Hello World
Our Hello World application is a little richer than most. That's because the whole point of GluJS is to
skip the "just looks pretty" stuff and provide you with what you need for building a reactive application out of the gate.
So our Hello World has a little behavior (pressing the button toggles the title),
is localized via glu's built-in support, and (of course) starts with a specification.

The specification (in coffeescript because it keeps our specs very readable; you can use javascript if you'd like):

```coffeescript
Given 'the hello world app is launched', ->
  vm = null
  Meaning -> vm = glu.model {ns:'helloworld',mtype:'main'}
  ShouldHave 'set arriving to true', -> (expect vm.arriving).toBe true
  ShouldHave 'set message to a welcome', -> (expect vm.message).toBe 'Hello World!'
  When 'the user changes his/her status', ->
    Meaning -> vm.set('arriving', false)
    ShouldHave 'set message to a farewell', -> (expect vm.message).toBe 'Goodbye World!'
```
The actual application (javascript):
```javascript
glu.defModel('helloworld.main', {
    arriving:true,
    message$:function () {
        return this.localize(this.arriving ? 'greeting' : 'farewell')
    }
});

glu.defView('helloworld.main', {
    title:'@{message}',
    tbar:[
        {
            text:'Toggle',
            enableToggle:true,
            pressed:'@{arriving}'
        }
    ]
});

glu.ns('helloworld').locale = {
    greeting:'Hello World!',
    farewell:'Goodbye World!'
}

Ext.onReady(function(){glu.viewport('helloworld.main');});
```
##Getting GluJS

If you really just want the minified libraries, grab them here:

[http://gluJS.com/downloads](http://gluJS.com/downloads)

If you want the source and full examples, clone this project from github.

##Building/minifying
Install node if you haven't already.

Build using node command line

    node build.js build

##Running examples
Before you can run examples, you'll need to download and install your desired widget toolset into the lib folder.
We currently support the following:

- Ext JS 3.0.7+ (put in lib/extjs-3.x)
- Ext JS 4.0.5+ (put in lib/extjs-4.x)
- Sencha Touch 2.0+ (experimental, put in lib/touch-2.x)

and will shortly target Titanium.

After you build GluJS, uou can run directly from the fileysystem since we leverage GluJS's ability to mock back-end Ajax calls.
For instance, to run the 'agents' example:

    file:///Users/mikegai/Projects/gluJS/examples/agents/index.html

If you would like to avoid a build step and also debug into individual glu source files, we've provided a simple website
you can run in node:

    node app.js

We use a Jade layout template to individually reference all of the GluJS source files. We don't use
the Ext JS 4.x Loader framework because we want to make it simple when using non-Sencha widget sets as well.

The examples are laid out as follows:

    /examples/*name*/extjs3|extjs4

So to run the agent example for Ext JS 4:

    /examples/agents/extjs4

##Documentation

Online documentation:

-  [User Guide] (http://conarrative.github.com/glujs-guide)
-  [API Reference]
--  [ExtJS 3.x] (http://gluJS.com/docs/api/extjs3.x)
--  [ExtJS 4.x] (http://gluJS.com/docs/api/extjs4.x)

####Generating your own documentation
Documentation is generated using jsduck.  The github project for jsDuck is located at [https://github.com/senchalabs/jsduck]https://github.com/senchalabs/jsduck.

Install per their instructions so that jsduck is on your shell path.

From the command line with the path in the root of the GluJS project, run:

    jsduck --config jsduck.json


##Testing

We use the excellent jasmine BDD testing library for GluJS testing (and it's also core to how we help you develop and
test your own applications with GluJS).

Once you have the node "glu development" application running, simply hit the specification page:

http://localhost:8123/spec/extjs4

or for Ext JS 3.x testing

http://localhost:8123/spec/extjs3