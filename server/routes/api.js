var router = require('express').Router();
var passport = require('passport');
var Player = require('../../models/player');
var update = require('../../modules/update');

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
  Player.findOne({ username: new RegExp('^'+username+'$', "i") }, function(err, player) {
    if (err) {
      console.log('Error fetching information for', username, 'from database:', err);

      // Send JSON payload with error message
      res.status(500).json({
        success: false,
        message: 'Error fetching player'
      });
    } else if (!player) {
      // No player found
      res.status(404).json({
        success: false,
        message: 'No player found.'
      });
    } else {
      var stats = player.stats;
      res.status(200).json({
        success: true,
        message: 'Player found',
        data: stats
      });
    }
  });
});

// Return Overall stats
router.get('/stats/:username/overall', function(req, res) {
  // Get the username from the URL parameters
  var username = req.params.username;

  // Search for a player matching the provided username
  Player.findOne({ username: new RegExp('^'+username+'$', "i") }, function(err, player) {
    // Check for errors
    if (err) {
      console.log('Error fetching player information:', err);
      // Send JSON payload containing error message
      res.status(500).json({
        success: false,
        message: 'No player found'
      });
    } else if (!player) {
      // No player found
      res.status(404).json({
        success: false,
        message: 'No player found.'
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
router.get('/stats/:username/conquest', function(req, res) {
  // Get username from parameter
  var username = req.params.username;

  // Search for user in database
  Player.findOne({ username: new RegExp('^'+username+'$', "i") }, function(err, player) {
    var stats = player.stats.conquest;

    // Check for errors
    if (err) {
      console.log('Error fetching user info:', err);
      // Send response
      res.status(500).json({
        success: true,
        message: 'Player not found'
      });
    } else if (!player) {
      // No player found
      res.status(404).json({
        success: false,
        message: 'No player found.'
      });
    } else {
      res.status(200).json(stats);
    }
  });
});

// Return stats for Team Death Match game mode
router.get('/stats/:username/tdm', function(req, res) {
  // Get username from parameter
  var username = req.params.username;

  // Search for user in database
  Player.findOne({ username: new RegExp('^'+username+'$', "i") }, function(err, player) {
    var stats = player.stats.teamDeathMatch;

    // Check for errors
    if (err) {
      console.log('Error fetching user info:', err);
      // Send response
      res.status(500).json({
        success: true,
        message: 'Player not found'
      });
    } else if (!player) {
      // No player found
      res.status(404).json({
        success: false,
        message: 'No player found.'
      });
    } else {
      res.status(200).json(stats);
    }
  });
});

// Return stats for Free For All game mode
router.get('/stats/:username/ffa', function(req, res) {
  // Get username from parameter
  var username = req.params.username;

  // Search for user in database
  Player.findOne({ username: new RegExp('^'+username+'$', "i") }, function(err, player) {
    var stats = player.stats.freeForAll;

    // Check for errors
    if (err) {
      console.log('Error fetching user info:', err);
      // Send response
      res.status(500).json({
        success: true,
        message: 'Player not found'
      });
    } else if (!player) {
      // No player found
      res.status(404).json({
        success: false,
        message: 'No player found.'
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
  update.conquest(username, gameData, function(status) {
    res.status(status).json({
      success: update.success(status),
      message: update.message(status)
    })
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
  var status = update.tdm(username, gameData, function(status){
    res.status(status).json({
      success: update.success(status),
      message: update.message(status)
    });
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
  update.ffa(username, gameData, function(status) {
    res.status(status).json({
      success: update.success(status),
      message: update.message(status)
    })
  })
});

/*******************************************************************************
                        Player Account Information
*******************************************************************************/
router.get('/players/:username', function(req, res) {
  var username = req.params.username;
  var playerData = {};

  // Find player in the database
  Player.findOne({ username: new RegExp('^'+username+'$', "i") }, function(err, player) {
    console.log(player);
    if (err) {
      console.log('Error fetching player from database:', err);

      // Response from server
      res.status(500).json({
        success: false,
        message: 'Internal error.'
      });
    } else if (!player) {
      // Response for no player found in database
      // Response from server
      res.status(404).json({
        success: false,
        message: 'No player found'
      });
    } else {
      // Set only the profile info.
      playerData = {
        username: player.username,
        picture: player.picture,
        joined: player.joined
      }
      // Respond with player data
      res.status(200).json({
        success: true,
        message: 'Player found.',
        data: playerData
      });
    }
  });
});

// Return all players
router.get('/players', function(req, res) {

  // Fetch all users from the database
  Player.find({}, function(err, players) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal error.'
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Players found.',
        data: players
      });
    }
  });
});

// Create a new player
router.post('/players', function(req, res) {
  // Create player object from the request body
  var playerData = {
    username: req.body.username,
    password: req.body.password,
    joined: Date.now() // Gets the date when created
  }

  // Send playerData to the database
  Player.create(playerData, function(err) {
    if (err.errors.username) {
      res.status(409).json({
        success: false,
        message: 'Username taken.'
      });
    } else if (err) {
      console.log('Error creating player:', err);
      res.status(500).json({
        success: false,
        message: 'Error creating player.'
      });
    } else {
      res.status(201).json({
        success: true,
        message: 'Player created.'
      });
    }
  });
});

// Delete a player
router.delete('/players/:username', function(req, res) {
  var username = req.params.username;

  Player.findOne({ username: new RegExp('^'+username+'$', "i") }).remove(function(err) {
    if (err) {
      console.log('Error deleting user');
      res.status(500).json({
        success: false,
        message: 'Error deleting user.'
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Player deleted.'
      });
    }
  });
});

// Update a profile
router.patch('/players/:username', function(req, res) {
  var username = req.params.username;

  // Find and update the user
  Player.findOne({ username: new RegExp('^'+username+'$', "i") }, function(err, player) {
    if (err) {
      console.log('Error finding player:', err);
      res.status(500).json({
        success: false,
        message: 'Internal Error'
      })
    } else if(!player) {
      res.status(404).json({
        success: false,
        message: 'No player found'
      });
    } else {
      // Check for username and add to object if found
      if(req.body.username) {
        player.username = req.body.username;
      }

      // Check for password and add to object if found
      if(req.body.password) {
        player.password = req.body.password;
      }

      // Check for profile picture and add to object if found
      if(req.body.picture) {
        player.picture = req.body.picture;
      }

      player.save(function(err) {
        if(err) {
          console.log('Error saving user to database');
          res.status(500).json({
            success: false,
            message: 'Internal error.'
          });
        } else {
          res.status(201).json({
            success: true,
            message: 'Player profile updated.'
          });
        }
      });
    }
  });
});

// Ban a player
router.patch('/players/:username/ban', function(req, res) {
  var username = req.params.username;
  var playerData = {
    banned: true
  }

  Player.findOneAndUpdate({ username: new RegExp('^'+username+'$', "i") }, playerData, function(err) {
    if (err) {
      console.log('Error banning player');
      res.status(500).json({
        success: false,
        message: 'Error occured while attempting to ban player'
      });
    } else {
      res.status(201).json({
        success: true,
        message: 'Player banned.'
      });
    }
  });
});

// Unban a player
router.patch('/players/:username/unban', function(req, res) {
  var username = req.params.username;
  var playerData = {
    banned: false
  }

  Player.findOneAndUpdate({ username: new RegExp('^'+username+'$', "i") }, playerData, function(err) {
    if (err) {
      console.log('Error unbanning player');
      res.status(500).json({
        success: false,
        message: 'Error occured while attempting to unban player'
      });
    } else {
      res.status(201).json({
        success: true,
        message: 'Player unbanned.'
      });
    }
  });
});

// Give player developer permissions
router.patch('/players/:username/developer', function(req, res) {
  var username = req.params.username;
  var playerData = {
    developer: true
  }

  Player.findOneAndUpdate({ username: new RegExp('^'+username+'$', "i") }, playerData, function(err) {
    if (err) {
      console.log('Error making player a developer');
      res.status(500).json({
        success: false,
        message: 'Error occured while attempting to give player developer permissions'
      });
    } else {
      res.status(201).json({
        success: true,
        message: 'Granted developer permissoins.'
      });
    }
  });
});



/*******************************************************************************
                              Authentication
*******************************************************************************/
router.post('/auth', function(req, res) {
  passport.authenticate('local', function(err, player) {
    if (err) {
      console.log('Error logging in:', err);
      res.status(500).json({
        success: false,
        message: 'Error authenticating user'
      });
    } else if (player === false) {
      res.status(404).json({
        success: false,
        message: 'Player not authenticated'
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Player authenticated.'
      });
    }
  })(req, res)
});

// Compare password for web app authentication
router.post('/auth/site', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  // Search for player in database
  Player.findOne({ username: new RegExp('^'+username+'$', "i") }, function(err, player) {
    if (err) {
      console.log('Error fetching user from database:', err);
      res.status(500).json({
        success: false,
        message: 'Internal Error'
      })
    } else if (!player) { // Checks to see if player object is empty
      res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    } else {
      // Compare password
      player.comparePassword(password, function(err, isMatch) {
        if (err) {
          console.log('Error comparing passwords:', err);
          res.status(500).json({
            success: false,
            message: 'Internal error.'
          });
        }

        if (isMatch) {
          res.status(200).json({
            success: true,
            message: 'Passwords match.',
            data: {
              id: player._id,
              username: player.username,
              picture: player.picture,
              joined: player.joined,
              developer: player.developer,
              admin: player.admin
            }
          });
        } else {
          res.status(200).json({
            success: false,
            message: 'Passwords are different.'
          });
        }
      });
    }
  });
});

// Return data on user for deserializing on the website application
router.post('/auth/site/deserialize', function(req, res) {
  var id = req.body.id;

  Player.findById(id, function(err, player) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal error.'
      });
    } else if (!player) {
      res.status(404).json({
        success: false,
        message: 'No player found.'
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Player found.',
        data: {
          id: player._id,
          username: player.username,
          picture: player.picture,
          joined: player.joined,
          developer: player.developer,
          admin: player.admin
        }
      });
    }
  });
});
module.exports = router;
