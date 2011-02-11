var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectID = Schema.ObjectId;

var torrentSchema = new Schema({
  name : String,
  uploader : ObjectID,
  group : ObjectID,
  date : Date,
  filesize : Number,
  snatched: Number,
  category : ObjectID
});

mongoose.model('Torrent', torrentSchema);

exports.Torrent = function(db) {
  return db.model('Torrent');
};

