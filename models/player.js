var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  picture: { type: String, required: false },
  joined: { type: Date, required: true },
  stats: {
    overall: {
      rank: Number,
      kills: Number,
      deaths: Number,
      won: Number,
      lost: Number,
      gamesPlayed: Number,
    },
    conquest: {
      kills: Number,
      deaths: Number,
      won: Number,
      lost: Number,
      objectives: Number,
      gamesPlayed: Number,
    },
    teamDeathMatch: {
      kills: Number,
      deaths: Number,
      won: Number,
      lost: Number,
      gamesPlayed: Number
    },
    freeForAll: {
      kills: Number,
      deaths: Number
    }
  }
});

var Player = mongoose.model('Player', playerSchema);

module.exports = Player;
