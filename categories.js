var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectID = Schema.ObjectId;

var categorySchema = new Schema({
  name : String,
  category : ObjectID
});

mongoose.model('Category', categorySchema);

exports.Category = function(db) {
  return db.model('Category');
};

