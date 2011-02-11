
/**
 * Module dependencies.
 */

var express = require('express');

// Models
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/nyaa2');
var Torrent = require('./torrents.js').Torrent(db);
var Category = require('./categories.js').Category(db);
var User = require('./users.js').User(db);



var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  Torrent.find({}, function(err, torrents) { 
    res.render('browse', {
      locals: {
        title: 'Browsing All Torrents',
        torrents: torrents
      }
    });
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
