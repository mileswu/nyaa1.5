
/**
 * Module dependencies.
 */
require('joose')
require('joosex-namespace-depended')

var crypto = require('crypto');
var express = require('express');
var form = require('connect-form');
var fs = require('fs');
var bencode = require('dht-bencode');


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
  app.use(express.cookieDecoder());
  app.use(express.session({secret:'temp'}));
  app.use(express.methodOverride());
  app.use(form({keepExtensions: true}));
  app.use(app.router);
  app.use(express.staticProvider( + '/public'));
});

app.configure('development', function(){
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var salt = 'temp'

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

app.get('/login', function(req, res) {
  res.render('login', {
    locals: {
      title: 'Login',
      flash: req.flash()
    }
  });
});

app.post('/login', function(req, res) {
  if (req.body.username == '' || req.body.password == '') {
    req.flash('error', "You must fill in a username and password");
    res.redirect('/login');
    return;
  }
  var hasher = crypto.createHash('sha1');
  hasher.update(salt + req.body.password);

  User.findOne({username: req.body.username, password: hasher.digest('hex')}, function(err, u) {
    if(!u) {
      console.log('f')
      req.flash('error', "Invalid username/password combination");
      res.redirect('/login');
    }
    else {
      req.session.user = req.body.username
      res.redirect('/');
    }
  });
});

app.get('/logout', function(req, res) {
  req.session.user = undefined;
  res.redirect('back');
});

app.get('/upload', function(req, res) {
  res.render('upload', {
    locals: {
      title: 'Upload a torrent',
    }
  });
});

app.post('/upload', function(req, res) {
  req.form.complete(function(err, fields, files) {
    fs.readFile(files.torrent.path, function(err, data) {
      var s = bencode.bdecode(data);
      var hasher = crypto.createHash('sha1');
      hasher.update(bencode.bencode(s.info));
      var infohash = hasher.digest('hex');
      
    });
    //fs.rename(files.torrent.path, __dirname + '/' +  
    res.redirect('/');
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
