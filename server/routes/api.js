var router = require('express').Router();
var User = require('../../models/user');

router.get('/', function(req, res) {
  res.sendStatus(200);
});

/*******************************************************************************
                                  Stats
*******************************************************************************/
// Return all stats for a player
router.get('/stats/:username', function(req, res) {
  var username = req.params.username;

  User.findOne({ username: username }, function(err, player) {
    if (err) {
      console.log('Error fetching information for', username, 'from database:', err);
      res.sendStatus(500);
    } else {
      var stats = player.stats;
      res.send(stats);
    }
  });
})

module.exports = router;
