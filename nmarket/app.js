var express = require('express');
var passport = require('passport');
var BrowserIDStrategy = require('passport-browserid').Strategy;
var render = require('connect-render');

passport.serializeUser(function(user, done) {
  console.log('serializeUser:' + user + ',' + user.email);
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  console.log('deserializeUser:' + email);
  done(null, {email: email});
});

passport.use(new BrowserIDStrategy({
  audience: 'http://localhost:3000'
  },
  function(email, done) {
    /*User.findByEmail({ email: email }, function (err, user) {
      return done(err, user);
    });*/
    return done(null, {email:email});
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

app.get('/login', function(req,res) {
  res.render('login', {user: req.user});
});

app.get('/logout', function(req,res) {
  req.logout();
  res.redirect('/');
});

app.post('/auth/browserid',
  passport.authenticate('browserid', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/', function(req,res) {
  console.log('user: ' + req.user);
  res.render('index', {user: req.user});
});

var server = app.listen(3000);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

