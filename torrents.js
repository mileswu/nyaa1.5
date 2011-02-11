var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId;

var torrentSchema = new Schema({
  name : String,
  uploader : ObjectID,
  group : ObjectID,
  date : { type: Date, default: Date.now},
  filesize : Number,
  snatched: Number
  category : ObjectID
});

mongoose.model('Torrent', torrentSchema);

exports.Torrent = function(db) {
  return db.model('Torrent');
};

