var mongoose = require('mongoose');
var config = require('./config');

var publicAPI = {
  connect: function() {
    var MongoDB = mongoose.connect(config.mongoURL).connection;

    MongoDB.on('error', function(err) {
      console.log('Error connecting to database:', err);
    });

    MongoDB.on('open', function() {
      console.log('Connection to database open');
    });
  }
};

module.exports = publicAPI;
