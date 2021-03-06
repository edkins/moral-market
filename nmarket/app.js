var secure = false;    // For testing, having to log in each time is a pain

var express = require('express');
var passport = require('passport');
var BrowserIDStrategy = require('passport-browserid').Strategy;
var render = require('connect-render');
var database = require('./database.js');
var transactions = require('./transactions.js');

passport.serializeUser(function(user, done) {
  done(null, user.rowid);
});

passport.deserializeUser(function(rowid, done) {
  database.user.find_by_rowid(rowid, done);
});

passport.use(new BrowserIDStrategy({
  audience: 'http://localhost:3000'
  },
  function(email, done) {
    database.user.find_or_create_by_email(email, done);
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

app.use('/static', express.static(__dirname + '/static'));

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

app.get('/login_failed', function(req,res) {
  res.render('login_failed', {user: req.user});
});

app.get('/login_required', function(req,res) {
  res.render('login_required', {user: req.user});
});

app.get('/', testWithoutLogin, function(req,res) {
  res.render('index', {user: req.user});
});

app.get('/users', ensureAdmin, function(req,res) {
  database.user.all(function(err,users) {
    res.render('users', {user: req.user, users: users});
  });
});

app.get('/charities', testWithoutLogin, ensureAuthenticated, function(req,res) {
  database.charity.all_by_user(req.user.rowid, function(err,charities) {
    res.render('charities', {user: req.user, charities: charities});
  });
});

app.get('/projects', testWithoutLogin, ensureAuthenticated, function(req,res) {
  database.user.all(function(err,users) {
    if (err || users == null) { throw 'Was expecting some users'; }
    database.project.all(function(err,projects) {
      if (err)
        res.render('bad', {user: req.user, error:err});
      else
        res.render('projects', {user: req.user, projects: projects, users: users});
    });
  });
});

app.get('/partition/:projectid', testWithoutLogin, ensureAuthenticated, function(req,res) {
  database.user.all(function(err,users) {
    if (err || users == null) { throw 'Was expecting some users'; }
    database.project.all(function(err,projects) {
      if (err) { throw 'Error getting projects'; }
      database.project.find_by_rowid(req.params.projectid, function(err,project) {
        if (err || project == null || project.partitioned)
          res.render('bad', {user: req.user, error:err});
        else
          res.render('partition', {user: req.user, projects:projects, users:users, project:project});
      });
    });
  });
});

app.post('/partition/:projectid', testWithoutLogin, ensureAuthenticated, function(req,res) {
  transactions.partition([
      req.body.contributor1, req.body.contributor_percentage1,
      req.body.contributor2, req.body.contributor_percentage2,
      req.body.contributor3, req.body.contributor_percentage3,
      req.body.contributor4, req.body.contributor_percentage4,
      req.body.contributor5, req.body.contributor_percentage5
      ],[
      req.body.influence1, req.body.influence_percentage1,
      req.body.influence2, req.body.influence_percentage2,
      req.body.influence3, req.body.influence_percentage3,
      req.body.influence4, req.body.influence_percentage4,
      req.body.influence5, req.body.influence_percentage5
      ], function(err) {
        if (err)
          res.render('bad', {user: req.user, error:err});
        else
          res.redirect('/projects');
      }
    );
});

app.get('/buy/:ownershipid', testWithoutLogin, ensureAuthenticated, function(req,res) {
  database.user.all(function(err,users) {
    if (err || users == null) { throw 'Was expecting some users'; }
    database.ownership.find_by_rowid(req.params.ownershipid, function(err, ownership) {
      if (err || ownership == null) {
        res.render('bad', {user: req.user, error:err});
      } else {
        res.render('transaction', {user: req.user, users:users, quantity:ownership.quantity, url:ownership.url, contributor:ownership.contributor, user_from:ownership.user, user_to:req.user.rowid, transfers:[]});
      }
    });
  });
});

app.get('/sell/:ownershipid', testWithoutLogin, ensureAuthenticated, function(req,res) {
  database.user.all(function(err,users) {
    if (err || users == null) { throw 'Was expecting some users'; }
    database.ownership.find_by_rowid(req.params.ownershipid, function(err, ownership) {
      if (err || ownership == null) {
        res.render('bad', {user: req.user, error:err});
      } else {
        res.render('transaction', {user: req.user, users:users, quantity:ownership.quantity, url:ownership.url, contributor:ownership.contributor, user_from:ownership.user, user_to:null, transfers:[]});
      }
    });
  });
});

app.post('/add_project', testWithoutLogin, ensureAuthenticated, function(req,res) {
  database.project.add(req.body.url, function(err) {
    if (err)
      res.render('bad', {user: req.user, error:err});
    else
      res.redirect('/projects');
  });
});

app.post('/add_contributor/:projectid', testWithoutLogin, ensureAuthenticated, function(req,res) {
  database.contribution.add_email(req.body.email, req.params.projectid, function(err) {
    if (err)
      res.render('bad', {user: req.user, error:err});
    else
      res.redirect('/projects');
  });
});

/*app.post('/buy/:ownershipid', testWithoutLogin, ensureAuthenticated, function(req,res) {
  database.
});*/

app.get('/request_donation/:id', ensureAuthenticated, function(req,res) {
  database.charity.find_by_rowid(req.params.id, function(err, charity) {
    if (err || charity == null) {
      res.render('bad', {user: req.user});
    } else {
      res.render('request_donation', {user: req.user, charity: charity});
    }
  });
});

app.post('/points_per_utility', testWithoutLogin, ensureAuthenticated, function(req, res) {
  database.user.set_points_per_utility(req.user.rowid, req.body.points_per_utility, function(err) {
    if (err)
      res.sendStatus(500);
    else
      res.redirect('/');
  });
});

/* Ajaxy methods */

app.post('/rating', testWithoutLogin, ensureAuthenticated, function(req,res) {
  database.rating.set(req.user.rowid, req.body.charity, req.body.rating, function(err) {
    if (err)
      res.sendStatus(500);
    else
      res.sendStatus(200);   // ok but no content to return
  });
});

var server = app.listen(3000);

function testWithoutLogin(req, res, next) {
  if (!secure && !req.isAuthenticated()) {
    database.user.find_by_rowid(1, function(err, user) {
      if (err) {
        res.sendStatus(500);
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    next();
  }
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login_required');
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.admin) {
      return next();
    }
  }
  res.redirect('/login_required');
}
