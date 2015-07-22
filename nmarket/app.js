var connect = require('connect');
var passport = require('passport');
var BrowserIDStrategy = require('passport-browserid').Strategy;
var render = require('connect-render');

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
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

var app = connect();

app.use(
  render({
    root: __dirname + '/views',
    layout: 'layout.ejs',
    cache: false,
    helpers: {
      sitename: 'Moral market',
      starttime: new Date().getTime(),
      now: function (req,res) { return new Date(); }
    }
  })
);

app.use(connect.cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/login', function(req,res) {
  res.render('login.ejs', {user: req.user});
});

app.use('/logout', function(req,res) {
  req.logout();
  res.set('Location', '/');
});

app.use('/auth/browserid',
  passport.authenticate('browserid'),
  function(req, res) {
    res.writeHead(301, {Location: '/'});  // Redirect to /
    res.end();
  }
);

app.use('/', function(req,res) {
  res.render('index.ejs', {user: req.user});
});

var server = app.listen(3000);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.set('Location', '/login');
}

