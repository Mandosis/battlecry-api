var router = require('express').Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

router.get('/', function(req, res) {
  res.sendStatus(200);
});

router.get('/token', function(req, res) {

})

module.exports = router;
