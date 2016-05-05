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
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    } else if(!user.developer) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
    } else {
      var token = jwt.sign(user, config.secret, { expiresIn: 600000 });
      res.status(200).json({
        success: true,
        message: 'Token generated',
        token: token
      })
    }
  })(req, res);
});

module.exports = router;
