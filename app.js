/*
 * Copyright(c) 2012 by CoNarrative
 */

var express = require('express');
var jade = require('jade');
var fs = require('fs');
var app = express.createServer();

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname));
app.set('view options', { //turn off layouts for now...
    layout:false
});

//routes

//root

app.get('/', function (req, res) {
    var markdown = fs.readFileSync('README.md', 'ascii');
    res.render('index.jade',{});
});

//main specs
app.get('/spec/extjs3', function (req, res) {
    res.render('runner.jade', {locals:{extjs_version: 3}});
});
app.get('/spec/extjs4', function (req, res) {
    res.render('runner.jade', {locals:{extjs_version: 4}});
});

//examples
//app.get('/examples/assets/extjs3', function (req, res) {
//    res.render('assets.jade', {locals:{extjs_version: 3}});
//});
app.get('/examples/assets/extjs4', function (req, res) {
    res.render('assets.jade', {locals:{extjs_version: 4}});
});
app.get('/examples/assets/spec', function (req, res) {
    res.render('assetsRunner.jade', {locals:{extjs_version: 4}});
});
app.get('/examples/todomvc/extjs4', function (req, res) {
    res.render('todo.jade', {locals:{extjs_version: 4}});
});
app.get('/examples/todomvc/spec', function (req, res) {
    res.render('todoRunner.jade', {locals:{extjs_version: 4}});
});
app.get('/examples/helloworld/extjs3', function (req, res) {
    res.render('helloworld.jade', {locals:{extjs_version: 3}});
});
app.get('/examples/helloworld/extjs4', function (req, res) {
    res.render('helloworld.jade', {locals:{extjs_version: 4}});
});

//app.get('/examples/medical/extjs4', function (req, res) {
//    res.render('medical.jade', {locals:{extjs_version:4}});
//});
//app.get('/examples/medical/spec', function (req, res) {
//    res.render('medicalRunner.jade', {locals:{extjs_version:4}});
//});

//Sencha Touch (Experimental)
app.get('/spec/touch2',function(req,res){
    res.render('senchatouch-runner.jade',{extjs_version:'touch'});
});
app.get('/examples/assets-touch',function(req,res){
    res.render('asset-touch.jade',{locals:{extjs_version: 'touch'}});
});

app.get('/examples/todomvc/touch', function (req, res) {
    res.render('todo.jade', {locals:{extjs_version: 'touch'}});
});
//startup
var port = process.env.PORT || 8123;
app.listen(port, function () {
    console.log('GluJS development website listening on http://localhost:' + port);
});
