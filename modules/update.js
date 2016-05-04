var Player = require('../models/player');

module.exports = {
  overall: function(username) {
    var playerData = {};

    // Search for player
    Player.findOne({ username: username }, function(err, player) {
      if (err) {
        console.log('Error finding player:', err);
      } else {
        playerData = player;
      }
    });

    // Conquest Stats
    var cqKills = playerData.stats.conquest.kills;
    var cqDeaths = playerData.stats.conquest.deaths;
    var cqWon = playerData.stats.conquest.won;
    var cqLost = playerData.stats.conquest.lost;
    var cqPlayed = playerData.stats.conquest.gamesPlayed;

    // Team Death Match Stats
    var tdmKills = playerData.stats.teamDeathMatch.kills;
    var tdmDeaths = playerData.stats.teamDeathMatch.deaths;
    var tdmWon = playerData.stats.teamDeathMatch.won;
    var tdmLost = playerData.stats.teamDeathMatch.lost;
    var tdmPlayed = playerData.stats.teamDeathMatch.gamesPlayed;

    // Free For All Stats
    var ffaKills = playerData.stats.freeForAll.kills;
    var ffaDeaths = playerData.stats.freeForAll.deaths;
    var ffaPlayed = playerData.stats.freeForAll.gamesPlayed;

    // Combine stats from all game modes
    playerData.stats.overall.kills += cqKills + tdmKills + ffaKills;
    playerData.stats.overall.deaths += cqDeaths + tdmDeaths + ffaDeaths;
    playerData.stats.overall.won += cqWon + tdmWon;
    playerData.stats.overall.lost += cqLost + tdmLost;
    playerData.stats.overall.gamesPlayed += cqPlayed + tdmPlayed + ffaPlayed;

    // Update player in database
    Player.findOneAndUpdate({ username: username }, playerData, function(err) {
      if (err) {
        console.log('Error');
      }
    })
  },
  conquest: function(username, gameData) {
    var playerData = {};
    // Search for player in the database and get stats
    Player.findOne({ username: username }, function(err, player) {
      // Check for errors
      if (err) {
        console.log('Error finding player in database:', err);
      } else {
        var playerDataData = player;
      }
    });

    // Update stats based on new data from the game
    playerData.stats.conquest.kills += gameData.kills;
    playerData.stats.conquest.deaths += gameData.deaths;
    playerData.stats.conquest.captures += gameData.captures;
    playerData.stats.conquest.gamesPlayed += 1;

    // Check if the game was won and update the won/lost count
    if (gameData.won) {
      playerData.stats.conquest.won += 1;
    } else {
      playerData.stats.conquest.lost -= 1;
    }

    // Update the information in the database
    Player.findOneAndUpdate({ username: username }, playerData, function(err) {
      // Check for errors
      if (err) {
        console.log('Error finding and updateing user:', err);
      } else {
        // Update overall stats
        this.overall(username);
      }
    });
  },
  tdm: function(username, gameData) {
    var playerData = {};
    // Search for player in the database and get stats
    Player.findOne({ username: username }, function(err, player) {
      // Check for errors
      if (err) {
        console.log('Error finding player in database:', err);
      } else {
        var playerDataData = player;
      }
    });

    // Update stats based on new data from the game
    playerData.stats.teamDeathMatch.kills += gameData.kills;
    playerData.stats.teamDeathMatch.deaths += gameData.deaths;
    playerData.stats.teamDeathMatch.gamesPlayed += 1;

    // Check if the game was won and update the won/lost count
    if (gameData.won) {
      playerData.stats.teamDeathMatch.won += 1;
    } else {
      playerData.stats.teamDeathMatch.lost -= 1;
    }

    // Update the information in the database
    Player.findOneAndUpdate({ username: username }, playerData, function(err) {
      // Check for errors
      if (err) {
        console.log('Error finding and updateing user:', err);
      } else {
        // Update overall stats
        this.overall(username);
      }
    });
  },
  ffa: function(username, gameData) {
    var playerData = {};
    // Search for player in the database and get stats
    Player.findOne({ username: username }, function(err, player) {
      // Check for errors
      if (err) {
        console.log('Error finding player in database:', err);
      } else {
        var playerDataData = player;
      }
    });

    // Update stats based on new data from the game
    playerData.stats.freeForAll.kills += gameData.kills;
    playerData.stats.freeForAll.deaths += gameData.deaths;
    playerData.stats.freeForAll.gamesPlayed += 1;

    // Update the information in the database
    Player.findOneAndUpdate({ username: username }, playerData, function(err) {
      // Check for errors
      if (err) {
        console.log('Error finding and updateing user:', err);
      } else {
        // Update overall stats
        this.overall(username);
      }
    });
  }
};
