var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

var playerSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  picture: { type: String, required: false },
  admin: { type: Boolean, required: true, default: false },
  developer: { type: Boolean, required: true, default: false },
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
      captures: Number,
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

// Encrypt password before saving to the database
playerSchema.pre('save', function(next) {
  var player = this;

  // If the password was not changed, do not continue
  if (!user.isModified('password')) {
    return next();
  }

  // Create salt for hash
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(player.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }

      // Replace clear text with hashed password
      player.password = hash;

      next();
    });
  });
});

// Compare the proided password against the database
playerSchema.methods.comparePassword = function(candidatePassword, done) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return done(err);
    } else {
      done(null, isMatch);
    }
  });
};


var Player = mongoose.model('Player', playerSchema);

module.exports = Player;
