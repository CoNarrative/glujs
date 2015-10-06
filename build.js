var buildDir = 'build';

var path = require('path');
var UglifyJS = require("uglify-js");
var fs = require('fs');
var cli = require('commander');
var wrench = require('wrench');
var glob = require('glob-whatev')


cli
    .version('0.1.0')
    .option('--pretty', 'Skip uglification and just concatenate the files for debugging.')

cli
    .command('build')
    .description('concatenate (and uglify unless using --pretty) files and place them in the build directory')
    .action(build)

cli
    .command('clean')
    .description('erase the build directory and its contents')
    .action(clean)



function build() {
    clean();
    console.log('building all...');
    gluJS();
    gluJSTest();
    gluJSExt3();
    gluJSExt4();
    copyToBuild('MIT.LICENSE');
    copyToBuild('readme.txt');
    copyExamples();
}

function clean() {
    try {
        fs.statSync(buildDir)
        wrench.rmdirSyncRecursive('build');
        console.log('deleted old build.');
    } catch (e) {
        console.log('no old build to clean.');
    }
}

function copyExamples() {
    console.log('copying examples');
    copyDirs('examples', buildDir + '/examples', function(kind, dir, filename, contents) {
        if (filename.match(/^\./)) return false;
        if (kind === 'f' && (filename === 'index.html' || filename === 'runner.html')) {
            return contents.replace(/\.\.\/\.\.\/build\/glu/g, '../../glu');
        }
    });
    wrench.mkdirSyncRecursive(buildDir + '/lib/extjs-4.x');
}

function gluJS() {
    console.log('building Core');
    var files = new FileList()
        .include('src/glu.js')
        .include('src/conventions.js')
        .include('src/viewmodel.js')
        .include('src/list.js')
        .include('src/*.js');
    concat('build/glu.js', files);
}

function gluJSTest() {
    console.log('building test library');
    var files = new FileList()
        .include('src/test/*.js');
    concat('build/glu-test.js', files);
}

function gluJSExt3() {
    console.log('building Ext JS 3.x adapter');
    var files = new FileList()
        .include('src/providers/sencha/setup.js')
        .include('src/providers/sencha/*.js')
        .include('src/providers/sencha/adapters_extjs/basic.js')
        .include('src/providers/sencha/adapters_extjs/*.js')
        .include('src/providers/sencha/adapters_extjs3/*.js')
    concat('build/glu-extjs-3.js', files);
}

function gluJSExt4() {
    console.log('building Ext JS 4.x adapter');
    var files = new FileList()
        .include('src/providers/sencha/setup.js')
        .include('src/providers/sencha/*.js')
        .include('src/providers/sencha/adapters_extjs/basic.js')
        .include('src/providers/sencha/adapters_extjs/*.js')
        .include('src/providers/sencha/adapters_extjs4/*.js')
    concat('build/glu-extjs-4.js', files);
}

//MINI-BUILD LIBRARY
var license = "// Copyright (c) 2012 CoNarrative - http://www.conarrative.com/\n" +
    "// License: MIT (http://www.opensource.org/licenses/mit-license.php)\n" +
    "// GluJS version 1.1.0\n";

function concat(combined, files) {
    //make parent directory of combined output file
    var lastSlashIdx = combined.lastIndexOf('/');
    if (lastSlashIdx == -1) {
        lastSlashIdx = combined.lastIndexOf('\\');
    }
    if (lastSlashIdx > 0) {
        wrench.mkdirSyncRecursive(combined.substring(0, lastSlashIdx));
    }
    if (files.toArray) {
        files = files.toArray();
    }
    var out = files.map(function(filePath) {
        var src = fs.readFileSync(filePath, 'utf8');
        return cli.isPretty ?
            '//BEGIN ' + filePath + "\n" + src + '//END' + filePath + "\n" :
            src;
    });
    var final = cli.pretty ?
        license + '\n' + out.join('\n') :
        license + uglify(out.join(' '));
    fs.writeFileSync(combined, final, 'utf8');
}

function uglify(code) {
    ast = UglifyJS.parse(code);
    ast.figure_out_scope();
    compressor = UglifyJS.Compressor({
        unused: false,
        warnings: false
    });
    ast = ast.transform(compressor);
    return ast.print_to_string();
}

FileList = function() {
    this.files = {};
};
FileList.prototype.include = function(pattern) {
    var thisBatch = glob.glob(pattern);
    for (var i = 0; i < thisBatch.length; i++) {
        this.files[thisBatch[i]] = true;
    }
    return this;
}
FileList.prototype.toArray = function() {
    var files = [];
    for (var filename in this.files) {
        files.push(filename);
    }
    return files;
}

copyDirs = function(sourceDir, newDir, filter) {
    filter = filter || function() {};
    var checkDir = fs.statSync(sourceDir);
    try {
        fs.mkdirSync(newDir, checkDir.mode);
    } catch (e) {
        if (e.code !== 'EEXIST') throw e;
    }
    var files = fs.readdirSync(sourceDir);
    for (var i = 0; i < files.length; i++) {
        var filename = files[i];
        var destPath = newDir + '/' + filename;
        var currFile = fs.lstatSync(sourceDir + '/' + filename);
        if (currFile.isDirectory()) {
            //directory
            if (filter('d', sourceDir, filename) !== false) {
                copyDirs(sourceDir + '/' + filename, destPath, filter);
            }
        } else if (currFile.isSymbolicLink()) {
            //sym link
            var symlink = fs.readlinkSync(sourceDir + '/' + filename);
            if (filter('s', sourceDir, filename) != false) {
                fs.symlinkSync(symlink, destPath);
            }
        } else {
            //file
            var contents = fs.readFileSync(sourceDir + '/' + filename, 'utf8');
            var filtered = filter('f', sourceDir, filename, contents);
            if (filtered != false) {
                if (typeof(filtered) === 'string') {
                    contents = filtered;
                }
                fs.writeFileSync(destPath, contents);
            }
        }
    }
};

function copyToBuild(oldFileName) {
    oldFile = fs.createReadStream(oldFileName);
    newFile = fs.createWriteStream(buildDir + '/' + oldFileName);
    require('util').pump(oldFile, newFile);
}

//EXECUTE
cli.parse(process.argv);