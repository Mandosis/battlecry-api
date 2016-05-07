var Player = require('../models/player');

module.exports = {
  overall: function(username, done) {

    // Search for player
    Player.findOne({ username: new RegExp('^'+username+'$', "i") }, function(err, player) {
      if (err) {
        console.log('Error finding player:', err);
        done(500);
      } else if (!player) {
        done(404);
      } else {

        // Conquest Stats
        var cqKills = Number(player.stats.conquest.kills);
        var cqDeaths = Number(player.stats.conquest.deaths);
        var cqWon = Number(player.stats.conquest.won);
        var cqLost = Number(player.stats.conquest.lost);
        var cqPlayed = Number(player.stats.conquest.gamesPlayed);

        // Team Death Match Stats
        var tdmKills = Number(player.stats.teamDeathMatch.kills);
        var tdmDeaths = Number(player.stats.teamDeathMatch.deaths);
        var tdmWon = Number(player.stats.teamDeathMatch.won);
        var tdmLost = Number(player.stats.teamDeathMatch.lost);
        var tdmPlayed = Number(player.stats.teamDeathMatch.gamesPlayed);

        // Free For All Stats
        var ffaKills = Number(player.stats.freeForAll.kills);
        var ffaDeaths = Number(player.stats.freeForAll.deaths);
        var ffaPlayed = Number(player.stats.freeForAll.gamesPlayed);

        // Combine stats from all game modes
        player.stats.overall.kills = cqKills + tdmKills + ffaKills;
        player.stats.overall.deaths = cqDeaths + tdmDeaths + ffaDeaths;
        player.stats.overall.won = cqWon + tdmWon;
        player.stats.overall.lost = cqLost + tdmLost;
        player.stats.overall.gamesPlayed = cqPlayed + tdmPlayed + ffaPlayed;

        player.save(function(err) {

          if (err) {
            console.log(err);
            done(500);
          } else {
            done(201);
          }
        })
      }
    });
  },
  conquest: function(username, gameData, done) {

    // Set this to a variable to avoid scope changes
    var update = this;

    // Search for player in the database and get stats
    Player.findOne({ username: new RegExp('^'+username+'$', "i") }, function(err, player) {

      // Check for errors
      if (err) {
        console.log('Error finding player in database:', err);
        done(500);
      } else if (!player) {
        done(404);
      } else {

        // Update stats based on new data from the game
        player.stats.conquest.kills += Number(gameData.kills);
        player.stats.conquest.deaths += Number(gameData.deaths);
        player.stats.conquest.captures += Number(gameData.captures);
        player.stats.conquest.gamesPlayed += 1;

        // Check if the game was won and update the won/lost count
        if (gameData.won) {
          player.stats.conquest.won += 1;
        } else {
          player.stats.conquest.lost -= 1;
        }

        // Save the updated stats to the database
        player.save(function(err) {
          if (err) {
            console.log('Error faving player', err);
            done(500);
          } else {
            // Update the overall stats
            update.overall(username, function(status) {
              done(status);
            });
          }
        });
      }
    });
  },
  tdm: function(username, gameData, done) {
    // Set this to a variable to avoid scope changes
    var update = this;

    // Search for player in the database and get stats
    Player.findOne({ username: new RegExp('^'+username+'$', "i") }, function(err, player) {

      // Check for errors
      if (err) {
        console.log('Error finding player in database:', err);
        done(500);
      } else if (!player) {
        done(404);
      } else {

        // Update stats based on new data from the game
        player.stats.teamDeathMatch.kills += Number(gameData.kills);
        player.stats.teamDeathMatch.deaths += Number(gameData.deaths);
        player.stats.teamDeathMatch.gamesPlayed += 1;

        // Check if the game was won and update the won/lost count
        if (gameData.won) {
          player.stats.teamDeathMatch.won += 1;
        } else {
          player.stats.teamDeathMatch.lost -= 1;
        }

        // Save the updated stats to the database
        player.save(function(err) {
          if (err) {
            console.log('error saving plauer:', err);
            done(500);
          } else {
            // Update the overall stats
            update.overall(username, function(status) {
              done(status);
            });
          }
        });
      }
    });
  },
  ffa: function(username, gameData, done) {
    // Set this to a variable to avoid scope changes
    var update = this;

    // Search for player in the database and get stats
    Player.findOne({ username: new RegExp('^'+username+'$', "i") }, function(err, player) {

      // Check for errors
      if (err) {
        console.log('Error finding player in database:', err);
        done(500);
      } else if (!player) {
        done(404);
      } else {

        // Update stats based on new data from the game
        player.stats.freeForAll.kills += Number(gameData.kills);
        player.stats.freeForAll.deaths += Number(gameData.deaths);
        player.stats.freeForAll.gamesPlayed += 1;

        // Save the updated stats to the database
        player.save(function(err) {
          if (err) {
            console.log('error', err);
            done(500);
          } else {
            // Update the overall stats
            update.overall(username, function(status) {
              done(status);
            });
          }
        });
      }
    });
  },
  message: function(status) {
    switch(status) {
      // Success message
      case 201:
        return 'Stats updated.';
        break;

      // Not found message
      case 404:
        return 'No player found.';
        break;

      // Error message
      case 500:
        return 'Internal error.';
        break;
    }
  },
  success: function(status) {
    // Determine if update was successful
    if (status == 201) {
      return true;
    } else {
      return false;
    }
  }
};
