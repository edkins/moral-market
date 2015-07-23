var express = require('express');
var passport = require('passport');
var BrowserIDStrategy = require('passport-browserid').Strategy;
var render = require('connect-render');
var database = require('./database.js');

passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user.rowid + "," + user.email);
  done(null, user.rowid);
});

passport.deserializeUser(function(rowid, done) {
  console.log('deserializeUser: ' + rowid);
  database.user.find_by_rowid(rowid, done);
});

passport.use(new BrowserIDStrategy({
  audience: 'http://localhost:3000'
  },
  function(email, done) {
    database.user.find_by_email(email, done);
  }
));

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(require('express-logger')({path:"log.txt"}));
app.use(require('cookie-parser')());
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(require('express-session')({secret:'98439ax9d.acdf439arda.p9daa'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/logout', function(req,res) {
  req.logout();
  res.redirect('/');
});

app.post('/auth/browserid',
  passport.authenticate('browserid', { failureRedirect: '/login_failed' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/', function(req,res) {
  res.render('index', {user: req.user});
});

app.get('/login_failed', function(req,res) {
  res.render('login_failed', {user: req.user});
});

app.get('/login_required', function(req,res) {
  res.render('login_required', {user: req.user});
});

var server = app.listen(3000);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login_required');
}

