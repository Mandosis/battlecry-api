var router = require('express').Router();
var index = require('./index');
var api = require('./api')

// Routes
router.use('/', index);
router.use('/api', api);

module.exports = router;
