var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tokenSchema = new Schema({
  token: {type: String, required: true, unique: true},
  valid: {type: Boolean, required: true},
  owner: {type: String, required: true},
  use: {type: String, required: true}
});

var Token = mongoose.model('token', tokenSchema)

module.exports = Token;
