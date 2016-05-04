var router = require('express').Router();
var index = require('./index');
var api = require('./api')

// Public Routes
router.use('/', index);

// Private Routes
router.use('/api', api);

module.exports = router;
