var express = require('express');
var app = express.createServer();

//app.use(express.compress());

app.use(express.static(__dirname + '/'));
app.listen(8989);
