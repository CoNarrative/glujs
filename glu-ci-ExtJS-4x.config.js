module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'lib/extjs-4.x/ext-all.js',
            'build/glu-extjs-4.js',
            'build/glu.js',
            'build/glu-test.js',
            'spec/**/*.js'
        ],
        exclude: [
            'spec/run.js',
            'spec/Providers/touch/**/*.js'
        ],
        preprocessors: {
            '**/*.coffee': 'coffee'
        },
        reporters: ['progress'],
        port: 9876,
        runnerPort: 9100,
        colors: true,
        //logLevel: LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        captureTimeout: 60000,
        singleRun: true
    });
};

