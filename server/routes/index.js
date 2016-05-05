var router = require('express').Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var Player = require('../../models/player');
var config = require('../../modules/config');

router.get('/', function(req, res) {
  res.sendStatus(200);
});

router.post('/token', function(req, res) {
  passport.authenticate('local', function(err, user) {
    if(err) {
      console.log('Error authenticating user:', err);
      req.status(500).json({
        success: false,
        message: 'Error authenticating user'
      });
    } else if(!user) {
      res.status(200).json({
        success: false,
        message: 'User not authenticated'
      });
    } else {
      var token = jwt.sign(user, config.secret, { expiresIn: 600000 });
      res.status(200).json({
        success: true,
        message: 'Token generated',
        data: token
      })
    }
  })(req, res);
});

module.exports = router;
