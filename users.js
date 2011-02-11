var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId;

var userSchema = new Schema({
  username : String,
  password : String,
  email : String,
  created_on : { type: Date, default: Date.now},
  last_access: Date
});

mongoose.model('User', userSchema);

exports.User = function(db) {
  return db.model('User');
};

