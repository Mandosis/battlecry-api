var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local');
var bodyParser = require('body-parser');
var config = require('../modules/config');
var db = require('../modules/database');
var router = require('./routes/router');

var app = express();

// Open connection to database
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Router
app.use('/', router);

// Start server
var server = app.listen(config.port, function() {
  // Gets the port the app is running on
  var port = server.address().port;
  console.log('Listening on port', port + '. Press ctrl + c to exit.');
});
