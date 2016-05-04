var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

var tokenSchema = new Schema({
  token: {type: String, required: true, unique: true},
  valid: {type: Boolean, required: true},
  owner: {type: String, required: true},
  use: {type: String, required: true}
});

// Encrypt token before saving to the database
tokenSchema.pre('save', function(next) {
  var token = this;

  // If the token was not changed, do not continue
  if (!user.isModified('token')) {
    return next();
  }

  // Create salt for hash
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(token.token, salt, function(err, hash) {
      if (err) {
        return next(err);
      }

      // Replace clear text with hashed token
      token.token = hash;

      next();
    });
  });
});

// Compare the proided token against the database
tokenSchema.methods.compareToken = function(candidateToken, done) {
  bcrypt.compare(candidateToken, this.password, function(err, isMatch) {
    if (err) {
      return done(err);
    } else {
      done(null, isMatch);
    }
  });
};

var Token = mongoose.model('token', tokenSchema)

module.exports = Token;
