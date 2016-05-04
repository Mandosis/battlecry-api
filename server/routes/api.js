var router = require('express').Router();
var Player = require('../../models/player');
var update = require('../../models/update');

router.get('/', function(req, res) {
  res.sendStatus(200);
});

/*******************************************************************************
                                  Get Stats
*******************************************************************************/
// Return all stats for a player
router.get('/stats/:username', function(req, res) {
  // Get the username from the URL parameters
  var username = req.params.username;

  // Search for player in the database by username
  Player.findOne({ username: username }, function(err, player) {
    if (err) {
      console.log('Error fetching information for', username, 'from database:', err);

      // Send JSON payload with error message
      res.status(500).json({
        success: false,
        message: 'No player found'
      });
    } else {
      var stats = player.stats;
      res.status(200).json(stats);
    }
  });
});

// Return Overall stats
router.get('/stats/:username/overall', function(req, res) {
  // Get the username from the URL parameters
  var username = req.params.username;

  // Search for a player matching the provided username
  Player.findOne({ username: username }, function(err, player) {
    // Check for errors
    if (err) {
      console.log('Error fetching player information:', err);
      // Send JSON payload containing error message
      res.status(500).json({
        success: false,
        message: 'No player found'
      });
    } else {
      // Set to overall stats
      var stats = player.stats.overall;
      // Send overall stats as JSON object
      res.status(200).json(stats);
    }
  });
});

// Return stats for Conquest game mode
res.get('/stats/:username/conquest', function(req, res) {
  // Get username from parameter
  var username = req.params.username;

  // Search for user in database
  Player.findOne({ username: username }, function(err, player) {
    var stats = player.stats.conquest;

    // Check for errors
    if (err) {
      console.log('Error fetching user info:', err);
      // Send response
      res.status(500).json({
        success: true,
        message: 'Player not found'
      });
    } else {
      res.status(200).json(stats);
    }
  });
});

// Return stats for Team Death Match game mode
res.get('/stats/:username/tdm', function(req, res) {
  // Get username from parameter
  var username = req.params.username;

  // Search for user in database
  Player.findOne({ username: username }, function(err, player) {
    var stats = player.stats.teamDeathMatch;

    // Check for errors
    if (err) {
      console.log('Error fetching user info:', err);
      // Send response
      res.status(500).json({
        success: true,
        message: 'Player not found'
      });
    } else {
      res.status(200).json(stats);
    }
  });
});

// Return stats for Free For All game mode
res.get('/stats/:username/ffa', function(req, res) {
  // Get username from parameter
  var username = req.params.username;

  // Search for user in database
  Player.findOne({ username: username }, function(err, player) {
    var stats = player.stats.freeForAll;

    // Check for errors
    if (err) {
      console.log('Error fetching user info:', err);
      // Send response
      res.status(500).json({
        success: true,
        message: 'Player not found'
      });
    } else {
      res.status(200).json(stats);
    }
  });
});


/*******************************************************************************
                                Post Stats
*******************************************************************************/
// Conquest
router.post('/stats/:username/conquest', function(req, res) {
  // Get username from parameters
  var username = req.params.username;

  // Put data from game into object
  var gameData = {
    kills: req.body.kills,
    deaths: req.body.deaths,
    won: req.body.won,
    captures: req.body.captures
  }

  // Update stats
  update.conquest(username, gameData);

  // Send feedback
  res.status(201).json({
    success: true,
    message: 'Conquest stats updated'
  });
});

// Team Death Match
router.post('/stats/:username/tdm', function(req, res) {
  // Get username from parameters
  var username = req.params.username;

  // Put data from game into object
  var gameData = {
    kills: req.body.kills,
    deaths: req.body.deaths,
    won: req.body.won,
  }

  // Update stats
  update.tdm(username, gameData);

  // Send feedback
  res.status(201).json({
    success: true,
    message: 'Team Death Match stats updated.'
  });
});

// Free For All
router.post('/stats/:username/ffa', function(req, res) {
  // Get username from parameters
  var username = req.params.username;

  // Put data from game into object
  var gameData = {
    kills: req.body.kills,
    deaths: req.body.deaths,
  }

  // Update stats
  update.ffa(username, gameData);

  // Send feedback
  res.status(201).json({
    success: true,
    message: 'Free for All stats updated'
  });
});


module.exports = router;
