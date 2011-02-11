
/**
 * Module dependencies.
 */
require('joose')
require('joosex-namespace-depended')
require('hash')

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
  app.use(express.cookieDecoder());
  app.use(express.session({secret:'temp'}));
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

var salt = 'temp'

// Routes

app.get('/', function(req, res){
  console.log(req.session.user);
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
  User.findOne({username: req.body.username, password: Hash.sha1(salt + req.body.password)}, function(err, u) {
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

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
