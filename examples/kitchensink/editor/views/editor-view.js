glu.ns('ks');
ks.EditorView = Backbone.View.extend({
    el: 'body',
    initialize: function () {
        this.render();
    },
    events: {
        'click #myTab a[href="#model"]': 'openModelTab',
        'click #myTab a[href="#view"]': 'openViewTab',
        'click #myTab a[href="#specs"]': 'openSpecsTab',
        'click #examples-accord a':'exampleSelected'
    },
    render: function () {
        this.listenTo(this.model, 'change:viewContent', this.renderViewContent);
        this.listenTo(this.model, 'change:viewmodelContent', this.renderViewModelContent);
        this.listenTo(this.model, 'change:specsContent', this.renderSpecsContent);
        var html = Handlebars.compile($("#main-template").html());
        this.$el.html(html);
        this.initEditors();
    },
    /******* TABS *******/
    openViewTab: function (evt, b) {
        $(evt.target).tab('show')
    },
    openModelTab: function (evt, b) {
        $(evt.target).tab('show')
    },
    openSpecsTab: function (evt, b) {
        $(evt.target).tab('show')
    },
    /******* Examples *******/
    exampleSelected:function(evt){
        var selectedExample = $(evt.currentTarget).data('examplename');
        if(!selectedExample) return;

        this.model.exampleSelected(selectedExample);
    },
    /******* Editors *******/
    renderViewContent:function(vm,data){
        this.viewEditor.getSession().setValue(data)
    },
    renderViewModelContent:function(vm,data){
        this.viewModelEditor.getSession().setValue(data)
    },
    renderSpecsContent:function(vm,data){
        this.specsEditor.getSession().setValue(data)
    },

    initEditors:function(){
        this.viewEditor = ace.edit("view");
        this.viewEditor.setTheme("ace/theme/monokai");
        this.viewEditor.getSession().setMode("ace/mode/javascript");

        this.viewModelEditor = ace.edit("model");
        this.viewModelEditor.setTheme("ace/theme/monokai");
        this.viewModelEditor.getSession().setMode("ace/mode/javascript");

        this.specsEditor = ace.edit("specs");
        this.specsEditor.setTheme("ace/theme/monokai");
        this.specsEditor.getSession().setMode("ace/mode/javascript");

//        var editor2 = ace.edit("editor2");
//        editor2.setTheme("ace/theme/monokai");
//        editor2.getSession().setMode("ace/mode/javascript");
    }
});