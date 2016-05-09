var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var config = require('../modules/config');
var db = require('../modules/database');
var router = require('./routes/router');
var Player = require('../models/player.js');

var app = express();

// Open connection to database
db.connect();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Passport
passport.use('local', new localStrategy({
  passReqToCallback: true,
  usernameField: 'username'
 },
  function(request, username, password, done){

    Player.findOne({username: new RegExp('^'+username+'$', "i")}, function(err, player){
      if(err){
        console.log(err);
      }

      if(!player){
        return done(null, false, {message: 'Incorrect username or password'});
      }

      player.comparePassword(password, function(err, isMatch){
        if(err){
          console.log(err);
        }

        if(isMatch){
          return done(null, player)
        } else {
          return done(null, false, {message: 'Incorrect username or password'})
        }

      })

    })

  }
));

passport.serializeUser(function(player, done){
  done(null, player.id); //Trail of breadcrumbs back to user
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, player){
    if(err){
      done(err);
    } else {
      done(null, player);
    }
  })

})

// Router
app.use('/', router);

// Start server
var server = app.listen(config.port, function() {
  // Gets the port the app is running on
  var port = server.address().port;
  console.log('Listening on port', port + '. Press ctrl + c to exit.');
});
