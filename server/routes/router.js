var router = require('express').Router();
var jwt = require('jsonwebtoken');
var index = require('./index');
var api = require('./api');
var config = require('../../modules/config');

// Public Routes
router.use('/', index);

// User registration has to be setup before I can add authentication to the api.
// In order to generate a token, a user must be authenticated as either an admin or developer
// Private Routes
router.use(function(req, res, next) {
  // Get token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // Decode token
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Failed to authenticate token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } else {
    return res.status(403).json({
      success: false,
      message: 'No token provided.'
    });
  }
});

router.use('/v1', api);

module.exports = router;
