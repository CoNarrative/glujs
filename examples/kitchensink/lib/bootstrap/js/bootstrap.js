/*
 BBTree
 Version: 0.3.0

 Copyright (c) 2012 Dustin Nation

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var BBTree = function(options){
    /*************************MODELS*******************************/
    var Models = (function(){
        /**
         * @class   Folder Model Definition
         *
         * @augments     Backbone.Model
         * @constructs
         *
         * @property    {String}     name   Name of this folder
         * @property    {BBTree.Collections.BBTreeFolderCollection}     folders     Collection of folders that are children of this folder
         * @property    {BBTree.Collections.BBTreeLeafCollection}       leafs       Collection of leafs that are children of this folder
         * @property    {String}                                        type        "folder". Used as a helper for other functions
         */
        var BBTreeFolder = Backbone.Model.extend(
            /** @lends BBTreeFolder.prototype */
            {
                /**
                 * Sets the default attributes.
                 *
                 * @return {Object}
                 */
                defaults: function(){
                    return {
                        'folders': new Collections.BBTreeFolderCollection(),
                        'leafs': new Collections.BBTreeLeafCollection(),
                        'type': 'folder'
                    }
                },

                /**
                 * Tasks to be done on the instantiation of the model
                 */
                initialize: function(){
                    //Setup the helpers for the nested folder collection
                    this.get('folders').parent = this;
                    this.get('folders').name = 'folders';

                    //Setup the helpers for the nested leafs collection
                    this.get('leafs').parent = this;
                    this.get('leafs').name = 'leafs';
                },

                /**
                 * Not used
                 */
                getChildFolders: function(){
                    this.get("folders").fetchFolder({getChildren: true});
                },

                /**
                 * Gets the grand children of this model from the server
                 */
                getGrandChildren: function(){
                    var baseURL = this.collection.url,
                        thisModel = this;

                    //set the url of the collection this folder is in
                    this.collection.url += "/grand_children" ;

                    //fetch from the server
                    this.fetch({
                        //what to do when the grandchildren get back from the server
                        success: function(folder){
                            //convert the array of folders to a collection
                            thisModel.convertArrayToCollection("folders", {grandChildren: true});

                            //convert the array of leafs to a collection
                            thisModel.convertArrayToCollection("leafs", {grandChildren: true});
                        }
                    });

                    //put its url back to what it was
                    this.collection.url = baseURL;

                },

                /**
                 * Converts the xxx_array array of objects into a collection.
                 *
                 * @param   {String}    name                        "folders" or "leafs". The name of the collection you're converting
                 * @param   {Object}    options                     Options object
                 * @param   {Boolean}   options.grandChildren       Make these models grandchildren of this model
                 * @param   {Boolean}   options.children            Make these models children of this model
                 */
                convertArrayToCollection: function(name, options){
                    var array = this.get(name + "_array"),
                        arrayLength = array.length,
                        i, childCollection;

                    //convert the array into grandchildren nodes
                    if(options.grandChildren){
                        //for each object in the array:
                        for(i=0; i<arrayLength; i+=1){
                            //grab the collection that will be this object's parent (the child of this folder model)
                            childCollection = this.get("folders").get(array[i].parent_id).get(name);

                            //make sure that the parent exists and the node doesn't already exist
                            //TODO Error Handling.  Create a  parent if a parentless grandchild shows up?
                            if(childCollection != undefined && childCollection.get(array[i].id) === undefined){

                                //add this object to the collection (Backbone converts it to a model)
                                childCollection.add(array[i]);

                                //TODO Documentation.  Not sure exactly whats going on here. I wrote it awhile ago.
                                if(childCollection.get(array[i].id).get(name) != undefined){
                                    //Set URL of grand children's folder's collection
                                    childCollection.get(array[i].id).get(name).url = this.collection.url;
                                }
                            }
                        }
                    }

                    //convert the array into children nodes
                    if(options.children){
                        //for each object in the array
                        for(i=0; i<arrayLength; i+=1){
                            //grab the collection that these objects will go into
                            childCollection = this.get(name);

                            //make sure that the parent exists and the node doesn't already exist
                            if(childCollection != undefined && childCollection.get(array[i].id) === undefined){

                                //add this object to the collection (Backbone converts it to a model)
                                childCollection.add(array[i]);

                                //TODO Documentation.  Not sure exactly whats going on here. I wrote it awhile ago.
                                if(childCollection.get(array[i].id).get(name) != undefined){
                                    //Set URL of grand children's folder's collection
                                    childCollection.get(array[i].id).get(name).url = this.collection.url;
                                }
                            }
                        }
                    }

                    //get rid of the array that is now a collection
                    this.unset(name + "_array", {silent: true});
                },

                /**
                 * Gets the full path of the folder in the tree.
                 *
                 * @return {Object[]} Array of objects representing the nodes in between and including this folder and the root
                 */
                getFullPath: function(){
                    var path = [],
                        i,
                        tempContext = {};

                    //kick off the recursive adding of the parents to the path
                    this.getParent(this, path);

                    //reverse it so the root is at the beginning and this folder is at the end of the array
                    path.reverse();

                    return path;
                },

                /**
                 * Recursive helper used to add the parent of the current node to the path list. Calls itself again if the folder has a parent.
                 *
                 * @param {BBTree.Models.BBTreeFolder}   node       The folder thats being added to the path
                 * @param {Object[]}                     path       Array of objects that this node will be added to
                 * @return {Object[]}                               Array of objects representing the nodes in the path of the folder that called getFullPath
                 */
                getParent: function(node, path){
                    //Add the incoming folder to the path
                    path.push({
                        'name': node.get('name'),
                        'type': node.get('type'),
                        'id': node.get('id')
                    });

                    //If its not a root, add it's parent to the list
                    if(node.get('parent_id')){
                        this.getParent(node.collection.parent, path);
                    }

                    return path;
                }
            });
        /**
         * @class   Leaf Model Definition
         *
         * @augments     Backbone.Model
         * @constructs
         *
         * @property    {String}     name   Name of this folder
         * @property    {String}     type   "leaf". Used as a helper for other functions
         */
        var BBTreeLeaf = Backbone.Model.extend(
            /** @lends BBTreeLeaf.prototype */
            {
                /**
                 * Sets the default attributes.
                 *
                 * @return {Object}
                 */
                defaults: function(){
                    return {
                        name: "",
                        type: 'leaf'
                    }
                },

                /**
                 * Gets the full path of the leaf in the tree.
                 *
                 * @return {Object[]} Array of objects representing the nodes in between and including this leaf and the root
                 */
                getFullPath: function(){
                    var path = [],
                        i,
                        tempContext = {};

                    //kick off the recursive adding of the parents to the path
                    this.getParent(this, path);

                    //reverse it so the root is at the beginning and this folder is at the end of the array
                    path.reverse();

                    return path;
                },

                /**
                 * Recursive helper used to add the parent of the current node to the path list. Calls itself again if the node has a parent.
                 *
                 * @param {BBTree.Models.BBTreeLeaf|BBTree.Models.BBTreeFolder}     node       The tree thats being added to the path
                 * @param {Object[]}                                                path       Array of objects that this node will be added to
                 * @return {Object[]}                                                          Array of objects representing the nodes in the path of the tree that called getFullPath
                 */
                getParent: function(node, path){
                    //Add the incoming folder to the path
                    path.push({
                        'name': node.get('name'),
                        'type': node.get('type'),
                        'id': node.get('id')
                    });

                    //If its not a root, add it's parent to the list
                    if(node.get('parent_id')){
                        this.getParent(node.collection.parent, path);
                    }

                    return path;
                }
            });

        return {
            BBTreeFolder: BBTreeFolder,
            BBTreeLeaf: BBTreeLeaf
        }
    })();
    /**************************************************************/

    /*************************COLLECTIONS**************************/
    var Collections = (function(){
        /**
         * @class   Folder Collection Definitionl
         *
         * @augments     Backbone.Collection
         * @constructs
         *
         * @property    {String}     name   Name of this collection (used as a nesting helper)
         * @property    {String}     type   "leaf". Used as a helper for other functions
         */
        var BBTreeFolderCollection = Backbone.Collection.extend(
            /** @lends BBTreeFolderCollection.prototype */
            {
                model: Models.BBTreeFolder,

                /**
                 * Tasks to be done on the instantiation of the model
                 */
                initialize: function(){
                    //Setup for the nested collections helper
                    this.parent = {};
                    this.name = '';
                    this.bind('all', this.updateParent, this);
                },

                /**
                 * Builds onto the backbone fetch feature to retrieve folder info from the server
                 *
                 * @param {Object}  options                 Options object
                 * @param {Boolean} options.getRoots        True if retrieving the roots, False if anything else.
                 * @param {Boolean} options.getChildren     True if retrieving the roots, False if anything else.
                 */
                fetchFolder: function(options){
                    var thisCollection = this,
                        baseURL = this.url,
                        fetchData = {};

                    //set the url to fetch from
                    if(options.getRoots){
                        this.url += "/roots";
                    }
                    else if(options.getChildren){
                        this.url += "/child_folders/" + this.parent.get('id');
                    }

                    //do the fetch
                    this.fetch({
                        /**
                         * What to do when the server responds
                         *
                         * @param {Object}  folders   The array returned from the server
                         */
                        success: function(folders){
                            //Deal with root folders
                            if(options.getRoots){
                                //Tell the
                                thisCollection.parent.get("parentView").addAllRootFolderViews();
                                thisCollection.each(function(folder){
                                    folder.get('folders').url = baseURL;
                                    //                        folder.getChildFolders();
                                    folder.convertArrayToCollection("folders", {children: true});
                                });
                            }

                            //cycle thru each sub-folder to reset its url and trigger the add to make backbone do its thing
                            thisCollection.each(function(folder){
                                folder.get('folders').url = baseURL;
                                thisCollection.trigger("add", folder);
                            });
                        }
                    });

                    //reset the url since it may have been changed to either children or roots
                    this.url = baseURL;
                },

                addFoldersFromObject: function(object){
                    this.add(object);

                    this.each(function(folder){
                        if(folder.get('folders_array')){
                            folder.convertArrayToCollection("folders", {children: true});
                        }
                        if(folder.get('leafs_array')){
                            folder.convertArrayToCollection("leafs", {children: true});
                        }
                    });
                    this.parent.get("parentView").addAllRootFolderViews();
                }

            });

        /**
         * @class   Leaf Collection Definition
         *
         * @augments     Backbone.Collection
         * @constructs
         *
         */
        var BBTreeLeafCollection = Backbone.Collection.extend(
            /** @lends BBTreeLeafCollection.prototype */
            {
                model: Models.BBTreeLeaf,

                initialize: function(){
                    this.bind('all', this.updateParent, this);
                }
            });

        return {
            BBTreeFolderCollection: BBTreeFolderCollection,
            BBTreeLeafCollection: BBTreeLeafCollection
        }
    })();
    /**************************************************************/

    /*************************VIEWS********************************/
    var Views = (function(){
        var TreeAppView = Backbone.View.extend(

            {
                className: 'bbtree',

                events: {

                },

                initialize: function(){
                    var thisView = this;

                    this._viewPointers = {};

                    //only do stuff if a container has been supplied
                    if(this.options.hasOwnProperty("treeContainer")){
                        console.log(Trees)
                        if(Trees === {}){
                            console.log("BBTree Exists")
                        }
                        else{
                            Trees[this.options.treeContainer] = new Models.BBTreeFolder({parentView: this, treeID: this.options.treeContainer});
                        }

                        if(this.options.hasOwnProperty("url")){
                            Trees[this.options.treeContainer].get("folders").url = this.options.url;
                        }

                        if(this.options.hasOwnProperty("sortBy")){
                            Trees[this.options.treeContainer].get("folders").comparator = function(folder){
                                return folder.get(thisView.options.sortBy);
                            }
                        }

                        if(this.options.hasOwnProperty("containingView")){
                            if(this.options.hasOwnProperty('events')){
                                Events[this.options.treeContainer] = this.options.events;
                            }
                            else{
                                Events[this.options.treeContainer] = {};
                            }

                            if(this.options.hasOwnProperty('templates')){
                                Templates[this.options.treeContainer] = this.options.templates;
                            }

                            if(this.options.hasOwnProperty('templateVariables')){
                                TemplateVars[this.options.treeContainer] = this.options["templateVariables"];
                            }
                            BBTree.containingView = this.options.containingView;
                        }

                        this.render(undefined, null);
                    }
                },

                render: function(eventName, context){
                    //TODO Didn't end up needing the switch.  Remove it.
                    //Deal with inability to compare primitive undefined with Strings
                    if(typeof eventName === 'undefined'){
                        eventName = 'undefined'
                    }

                    switch(eventName){
                        //perform the initial render
                        case 'undefined':
                            this.initialRender();
                            break;
                    }

                    return this;
                },

                initialRender: function(){
                    var thisRoot = Trees[this.options.treeContainer];


                    $(this.el).appendTo($(this.options.treeContainer));

                    if(this.options.autoStart){
                        if(this.options.hasOwnProperty('url')){
                            thisRoot.get("folders").fetchFolder({getRoots: true});
                        }
                        if(this.options.hasOwnProperty('object')){
                            ObjectTree[this.options.treeContainer] = this.options.object;
                            thisRoot.get("folders").addFoldersFromObject(this.options.object);
                        }
                    }

                },

                addAllRootFolderViews: function(){
                    var treeView = this,
                        view,
                        rootView;
                    Trees[this.options.treeContainer].get("folders").each(function(rootFolder){
                        rootView = treeView.addFolderView(rootFolder, treeView);
                    });

                    for(view in this._viewPointers){
                        if(this._viewPointers.hasOwnProperty(view)){
                            $(this._viewPointers[view].el).show();
                            $(this._viewPointers[view].el).addClass("bbtree-folder-root");
                        }
                    }

                },

                addFolderView: function(folder, parentView){
                    var newFolderView;

                    if(folder.get("type") === "folder"){
                        newFolderView = new FolderView({model: folder, treeID: this.options.treeContainer});
                    }
                    else{
                        newFolderView = new LeafView({model: folder, treeID: this.options.treeContainer});
                    }

                    this._viewPointers[folder.cid] = newFolderView;

                    $(newFolderView.el).appendTo($(parentView.el));

                    return newFolderView;
                }


            });
        /**
         * @class       BBTree Folder Backbone.View Definition
         *
         * @augments    Backbone.View
         * @constructs
         *
         * @property    {String}    className       Class name of the DOM element this View will be.
         * @property    {Object}    template        Object holding the templates that this View will use.
         * @property    {Object}    templateVars    Object holding the variables that this View's template will need.
         * @property    {Object}    events          Defines the DOM events to listen for and their callbacks.
         * @property    {Object}    options         Options created based on parameters passed on instantiation of this view.
         */
        var FolderView = Backbone.View.extend(
            /** @lends FolderView.prototype */
            {
                className: 'bbtree-folder',

                events: {
                    'click .bbtree-folder-icon': "toggleNode",
                    'click .bbtree-folder-name': 'clickFolder'
                },

                initialize: function(){
                    var key;

                    if(TemplateVars.hasOwnProperty(this.options.treeID) && TemplateVars[this.options.treeID].hasOwnProperty("folders")){
                        this.templateVars = TemplateVars[this.options.treeID].folders(this);
                    }
                    else{
                        this.templateVars = TemplateVars.bbdefault["folders"](this);
                    }

                    if(Templates.hasOwnProperty(this.options.treeID) && Templates[this.options.treeID].hasOwnProperty("folders")){
                        this.template = Mustache.to_html(Templates[this.options.treeID].folders, this.templateVars);
                    }
                    else{
                        this.template = Mustache.to_html(Templates.bbdefault.folders, this.templateVars);
                    }

                    if(Events[this.options.treeID].hasOwnProperty('folders')){
                        for(key in Events[this.options.treeID]['folders']){
                            if(Events[this.options.treeID]['folders'].hasOwnProperty(key)){
                                this.events[key] = 'customEvent';
                            }
                        }
                    }

                    this._viewPointers = {};

                    this.model.bind("all", this.render, this);

                    this.render(undefined, null);

                    this.delegateEvents();
                },

                render: function(eventName, context){
                    //Deal with inability to compare primitive undefined with Strings
                    if(typeof eventName === 'undefined'){
                        eventName = 'undefined'
                    }

                    switch(eventName){
                        //perform the initial render
                        case 'undefined':
                            this.initialRender();
                            break;
                        case 'add:folders':
                            this.addChildFolderView(context);
                            break;
                        case 'add:leafs':
                            this.addChildLeafView(context);
                    }

                    return this;
                },

                initialRender: function(){
                    //TODO Mustache this up in harr
                    $(this.el).html(this.template);
                    $(this.el).hide();
                },

                addChildFolderView: function(folder, show){
                    var newFolderView = new FolderView({model: folder, treeID: this.options.treeID, parentView: this}),
                        cid,
                        addView = true;

                    for(cid in this._viewPointers){
                        if(this._viewPointers.hasOwnProperty(cid) && this._viewPointers[cid].model === folder){
                            addView = false;
                        }
                    }
                    if(addView){
                        this._viewPointers[folder.cid] = newFolderView;

                        $(newFolderView.el).appendTo($(this.el));
                        if(show){
                            $(newFolderView.el).show();
                        }
                    }

                },

                addChildLeafView: function(leaf, show){
                    var newLeafView = new LeafView({model: leaf, treeID: this.options.treeID, parentView: this}),
                        cid,
                        addView = true;

                    for(cid in this._viewPointers){
                        if(this._viewPointers.hasOwnProperty(cid) && this._viewPointers[cid].model === leaf){
                            addView = false;
                        }
                    }
                    if(addView){
                        this._viewPointers[leaf.cid] = newLeafView;

                        $(newLeafView.el).appendTo($(this.el));

                        if(show){
                            $(newLeafView.el).show();
                        }
                    }
                },

                toggleNode: function(event){
                    var view,
                        thisView = this;
                    event.stopPropagation();

                    if($(this.el).hasClass("bbtree-open")){
                        $(this.el).removeClass("bbtree-open");
                        $(this.el).children(".bbtree-folder-icon").removeClass("bbtree-folder-icon-open");
                        for(view in this._viewPointers){

                            if(this._viewPointers.hasOwnProperty(view)){
                                $(this._viewPointers[view].el).toggle();
                            }
                        }
                    }
                    else{
                        $(this.el).addClass("bbtree-open");
                        $(this.el).children(".bbtree-folder-icon").addClass("bbtree-folder-icon-open");
                        for(view in this._viewPointers){
                            if(this._viewPointers.hasOwnProperty(view)){
                                $(this._viewPointers[view].el).toggle();
                            }
                        }

                        if(ObjectTree.hasOwnProperty(this.options.treeID)){
                            this.model.get('folders').each(function(folder){
                                thisView.addChildFolderView(folder, true);

                                if(folder.get('folders_array')){
                                    folder.convertArrayToCollection("folders", {children: true});
                                }
                                if(folder.get('leafs_array')){
                                    folder.convertArrayToCollection("leafs", {children: true});
                                }

                            });

                            this.model.get('leafs').each(function(leaf){
                                thisView.addChildLeafView(leaf, true);
                            });
                        }
                        else{
                            this.model.getGrandChildren();
                        }

                    }

                },

                clickFolder: function(event){
                    event.stopPropagation();

                    if(Events[this.options.treeID].hasOwnProperty('folders')){
                        Events[this.options.treeID]['folders'].click(event, this);
                    }

                    if(Events[this.options.treeID].hasOwnProperty('both')){
                        Events[this.options.treeID]['both'].click(event, this);
                    }
                },

                customEvent: function(event){
                    var keyList = [],
                        i,
                        classList = event.currentTarget.className.split(/\s+/);

                    event.stopPropagation();

                    if(event.currentTarget.id){
                        keyList.push(event.type + " #" + event.currentTarget.id);
                    }
                    for(i=0; i< classList.length; i+=1){
                        keyList.push(event.type + " ." + classList[i]);
                    }

                    for(i=0; i<keyList.length; i+=1){
                        if(Events[this.options.treeID].hasOwnProperty('folders')){
                            if(Events[this.options.treeID]['folders'].hasOwnProperty(keyList[i])){
                                Events[this.options.treeID]['folders'][keyList[i]](event, this);
                            }
                        }
                        if(Events[this.options.treeID].hasOwnProperty('both')){
                            if(Events[this.options.treeID]['both'].hasOwnProperty(keyList[i])){
                                Events[this.options.treeID]['both'][keyList[i]](event, this);
                            }
                        }
                    }
                }
            });
        /**
         * @class       BBTree Leaf Backbone.View Definition
         *
         * @augments    Backbone.View
         * @constructs
         *
         * @property    {String}    className       Class name of the DOM element this View will be.
         * @property    {Object}    template        Object holding the templates that this View will use.
         * @property    {Object}    templateVars    Object holding the variables that this View's template will need.
         * @property    {Object}    events          Defines the DOM events to listen for and their callbacks.
         * @property    {Object}    options         Options created based on parameters passed on instantiation of this view.
         */
        var LeafView = Backbone.View.extend(
            /** @lends LeafView.prototype */
            {
                className: 'bbtree-leaf',

                events: {
                    'click .bbtree-leaf-name': 'clickLeaf'
                },

                initialize: function(){
                    var key;

                    if(TemplateVars.hasOwnProperty(this.options.treeID) && TemplateVars[this.options.treeID].hasOwnProperty("leafs")){
                        this.templateVars = TemplateVars[this.options.treeID].leafs(this);
                    }
                    else{
                        this.templateVars = TemplateVars.bbdefault["leafs"](this);
                    }

                    if(Templates.hasOwnProperty(this.options.treeID) && Templates[this.options.treeID].hasOwnProperty("leafs")){
                        this.template = Mustache.to_html(Templates[this.options.treeID].leafs, this.templateVars);
                    }
                    else{
                        this.template = Mustache.to_html(Templates.bbdefault.leafs, this.templateVars);
                    }

                    if(Events[this.options.treeID].hasOwnProperty('leafs')){
                        for(key in Events[this.options.treeID]['leafs']){
                            if(Events[this.options.treeID]['leafs'].hasOwnProperty(key)){
                                this.events[key] = 'customEvent';
                            }
                        }
                    }

                    this.render();
                    this.delegateEvents();
                },

                render: function() {
                    $(this.el).html(this.template);
                    $(this.el).hide();
                },

                clickLeaf: function(event){
                    event.stopPropagation();

                    if(Events[this.options.treeID].hasOwnProperty('leafs')){
                        Events[this.options.treeID]['leafs'].click(event, this);
                    }

                    if(Events[this.options.treeID].hasOwnProperty('both')){
                        Events[this.options.treeID]['both'].click(event, this);
                    }
                },

                customEvent: function(event){
                    var keyList = [],
                        i,
                        classList = event.currentTarget.className.split(/\s+/);

                    event.stopPropagation();

                    if(event.currentTarget.id){
                        keyList.push(event.type + " #" + event.currentTarget.id);
                    }
                    for(i=0; i< classList.length; i+=1){
                        keyList.push(event.type + " ." + classList[i]);
                    }

                    for(i=0; i<keyList.length; i+=1){
                        if(Events[this.options.treeID].hasOwnProperty('leafs')){
                            if(Events[this.options.treeID]['leafs'].hasOwnProperty(keyList[i])){
                                Events[this.options.treeID]['leafs'][keyList[i]](event, this);
                            }
                        }
                        if(Events[this.options.treeID].hasOwnProperty('both')){
                            if(Events[this.options.treeID]['both'].hasOwnProperty(keyList[i])){
                                Events[this.options.treeID]['both'][keyList[i]](event, this);
                            }
                        }
                    }
                }
            });

        return {
            TreeAppView: TreeAppView
        }
    })();
    /**************************************************************/

    /*************************DEFAULT TEMPLATING*******************/
    var Templates = (function(){
        var bbdefault = {};

        bbdefault["leafs"] = "\
            <div class='bbtree-leaf-icon'></div>\
            <div class='bbtree-leaf-name' data='{{leaf_id}}'>{{leaf_name}}</div>\
        ";


        bbdefault["folders"] = "\
            <div class='bbtree-folder-icon'></div>\
            <div class='bbtree-folder-name' data='{{folder_id}}'>{{folder_name}}</div>\
        ";

        return {
            bbdefault: bbdefault
        }
    })();

    var TemplateVars = (function(){
        var bbdefault = {};

        bbdefault["leafs"] = function(view){
            return {
                leaf_id: view.model.get('id'),
                leaf_name: view.model.get('name')
            }
        };

        bbdefault["folders"] = function(view){
            return {
                folder_id: view.model.get('id'),
                folder_name: view.model.get('name')
            }
        };

        return {
            bbdefault: bbdefault
        }
    })();
    /**************************************************************/

    /*************************MISC DECLARATIONS********************/
    var Trees = {};
    var Events = {};
    var ObjectTree = {};
    /**************************************************************/

    /*************************PUBLIC FUNCTIONS*********************/
    var close = function(){
        appView.close();
    };
    /**************************************************************/

    //Start up the app
    var appView = new Views.TreeAppView(options);

    return {
        Views: Views,
        close: close
    }
};

/*************************HELPERS******************************/
Backbone.Collection.prototype.updateParent = function(eventName, model){
    if(!model.hasOwnProperty('collection') && model.hasOwnProperty('parent')){
        switch(eventName){
            case "reset":
                model.parent.trigger("reset:" + model.name, model);
                break;
        }
    }
    if(model.hasOwnProperty('collection') && model.collection.hasOwnProperty('parent') && model.collection.hasOwnProperty('name')){
        switch(eventName){
            case "add":
                model.collection.parent.trigger("add:" + model.collection.name, model);
                break;
            case "remove":
                model.collection.parent.trigger("remove:" + model.collection.name, model);
                break;
        }
    }
};

Backbone.View.prototype.close = function(){
    var pointer;
    this.remove();
    this.unbind();
    if(this.hasOwnProperty('_viewPointers')){
        for(pointer in this._viewPointers){
            if(this._viewPointers.hasOwnProperty(pointer)){
                this._viewPointers[pointer].close();
            }
        }
    }
};
/**************************************************************/