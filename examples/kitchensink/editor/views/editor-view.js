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
        'click #examples-accord a': 'exampleSelected',
        'click .preview-btn': 'previewApp',
        'click .runspecs-btn':'runSpecs'
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
        evt.preventDefault();
        $(evt.target).tab('show')
    },
    openModelTab: function (evt, b) {
        evt.preventDefault();
        $(evt.target).tab('show')
    },
    openSpecsTab: function (evt, b) {
        evt.preventDefault();
        $(evt.target).tab('show')
    },
    /******* Examples *******/
    exampleSelected: function (evt) {
        var selectedExample = $(evt.currentTarget).data('examplename');
        if (!selectedExample) return;

        this.model.exampleSelected(selectedExample);
    },
    /******* Editors *******/
    renderViewContent: function (vm, data) {
        this.viewEditor.getSession().setValue(data)
    },
    renderViewModelContent: function (vm, data) {
        this.viewModelEditor.getSession().setValue(data)
    },
    renderSpecsContent: function (vm, data) {
        this.specsEditor.getSession().setValue(data)
    },

    initEditors: function () {
        this.viewEditor = ace.edit("view");
        this.viewEditor.setTheme("ace/theme/monokai");
        this.viewEditor.getSession().setMode("ace/mode/javascript");
        this.viewEditor.getSession().on('change', function (e) {
            //TODO: Buffer event and update ViewModel
        });

        this.viewModelEditor = ace.edit("model");
        this.viewModelEditor.setTheme("ace/theme/monokai");
        this.viewModelEditor.getSession().setMode("ace/mode/javascript");
        this.viewModelEditor.getSession().on('change', function (e) {
            //TODO: Buffer event and update ViewModel
        });

        this.specsEditor = ace.edit("specs");
        this.specsEditor.setTheme("ace/theme/monokai");
        this.specsEditor.getSession().setMode("ace/mode/javascript");
        this.specsEditor.getSession().on('change', function (e) {
            //TODO: Buffer event and update ViewModel
        });
    },
    /******* Commands *******/
    previewApp: function () {
        $('#preview').empty();
        this.model.set('viewContent', this.viewEditor.getSession().getValue());
        this.model.set('viewmodelContent', this.viewModelEditor.getSession().getValue());

        $('#preview').append("<iframe id='app' src='app.html'></iframe>");
    },
    runSpecs: function () {
        $('#preview').empty();
        this.model.set('viewContent', this.viewEditor.getSession().getValue());
        this.model.set('viewmodelContent', this.viewModelEditor.getSession().getValue());
        this.model.set('specsContent', this.specsEditor.getSession().getValue());

        $('#preview').append("<iframe id='runner' src='specs/runner.html'></iframe>");
    }
});