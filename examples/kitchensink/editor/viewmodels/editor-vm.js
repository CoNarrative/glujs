glu.defModel('ks.editor', {
    mixins: ['backboneish'],
    init: function () {
        var me = this;
        PubSub.subscribe('appFrameLoaded', function (message, doc) {
            //TODO:  Use uglifyJS to minify the payload
            PubSub.publish('previewApp', me.viewContent + me.viewmodelContent)
        });
        PubSub.subscribe('RunnerLoaded', function (message, doc) {
            //TODO:  Use uglifyJS to minify the payload
            PubSub.publish('runSpecs', me.viewContent + me.viewmodelContent + me.specsContent);
        });
    },
    viewContent: '',
    viewmodelContent: '',
    specsContent: '',
    exampleSelected: function (exampleName) {
        var me = this;
        //Async is broke in Chrome.  Check on this issue, https://github.com/caolan/async/pull/269
//
//        async.auto({
//            getView: function (callback) {
//                $.ajax({
//                    url: "views/extjs/login_view.js",
//                    dataType: 'text'
//                }).done(function (data) {
//                        callback(null, data)
//                    })
//            },
//            updateViewModel: ['getView', function (err, results) {
//                var view = results.getView;
//                me.set('viewContent', view);
//            }]
//
//        })
        $.ajax({
            url: "views/extjs/login_view.js",
            dataType: 'text'
        }).done(function (data) {
                me.set('viewContent', data);
            });
        $.ajax({
            url: "viewmodels/login_vm.js",
            dataType: 'text'
        }).done(function (data) {
                me.set('viewmodelContent', data);
            });
        $.ajax({
            url: "specs/login-spec.js",
            dataType: 'text'
        }).done(function (data) {
                me.set('specsContent', data);
            });

    }
});