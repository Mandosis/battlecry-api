var router = require('express').Router();
var index = require('./index');
var api = require('./api')

// Public Routes
router.use('/', index);

// User registration has to be setup before I can add authentication to the api.
// In order to generate a token, a user must be authenticated as either an admin or developer 
// Private Routes
router.use('/api', api);

module.exports = router;
