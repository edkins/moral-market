var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var exists = fs.existsSync('db');
var db = new sqlite3.Database('db');

exports.user = {
  find_or_create_by_email: function(email, done) {
    db.get("SELECT rowid,* FROM user WHERE email=?", email, function(err,user){
      if (err) { return done(err, null); }
      if (user == null) {
        db.run("INSERT INTO user VALUES (?, 0, 0, 0)", email, function(err,dummy){
          if (err) { return done(err, null); }
          db.get("SELECT rowid,* FROM user WHERE email=?", done);
        });
      } else {
        done(err,user);
      }
    });
  },
  find_by_email: function(email, done) {
    db.get("SELECT rowid,* FROM user WHERE email=?", email, done);
  },
  find_by_rowid: function(rowid, done) {
    db.get("SELECT rowid,* FROM user WHERE rowid=?", rowid, done);
  },
  all: function(done) {
    db.all("SELECT rowid,* FROM user", done);
  },
  set_points_per_utility: function(rowid, points_per_utility, done) {
    db.get("UPDATE user SET points_per_utility=? WHERE rowid=?", points_per_utility, rowid, done);
  }
};

exports.offer_donation = {
  all: function(done) {
    db.all("SELECT rowid,* FROM offer_donation", done);
  }
};

exports.request_donation = {
  all: function(done) {
    db.all("SELECT rowid,* FROM request_donation", done);
  }
};

/*
The list of charities comes from http://www.effectivealtruism.org/organizations
*/

exports.charity = {
  all_by_user: function(userid, done) {
    //db.all('SELECT charity.rowid, charity.*, max(request_donation.points_per_money), utility_rating.utility_per_money FROM charity LEFT JOIN request_donation ON charity.rowid=request_donation.charity LEFT JOIN utility_rating ON charity.rowid=utility_rating.charity AND utility_rating.user=? GROUP BY charity.rowid', userid, done);
    db.all('SELECT charity.rowid, charity.*, utility_rating.utility_per_money FROM charity LEFT JOIN utility_rating ON charity.rowid=utility_rating.charity AND utility_rating.user=?', userid, done);
    //db.all('SELECT charity.rowid, charity.*, utility_rating.utility_per_money FROM charity LEFT JOIN utility_rating ON charity.rowid=utility_rating.charity AND utility_rating.user=?', userid, done);
  },
  find_by_rowid: function(rowid, done) {
    db.get('SELECT * FROM charity WHERE rowid=?', rowid, done);
  }
};

exports.rating = {
  set: function(userid, charityid, utility_per_money, done) {
    db.run('DELETE FROM utility_rating WHERE user=? AND charity=?', userid, charityid, function(err) {
      if (err) { done(err, null); }
      if (utility_per_money == 0) {
        done(err, null);
      } else {
        db.run('INSERT INTO utility_rating (user, charity, utility_per_money) VALUES (?, ?, ?)', userid, charityid, utility_per_money, done);
      }
    });
  }
};

exports.project = {
  all: function(done) {
    db.all('SELECT rowid, * FROM project', done);
  },
  find_by_rowid: function(rowid,done) {
    db.get('SELECT rowid, * FROM project WHERE rowid=?', rowid, done);
  },
  add: function(url,done) {
    db.run('INSERT INTO project VALUES (?, 0)', url, done);
  }
};

exports.contribution = {
  add_email: function(email, projectid, done) {
    exports.user.find_by_email(email, function(err, user) {
      if (err) { return done(err, null); }
      if (user == null) { return done('User not found:' + email, null); }
      userid = user.rowid;
      db.run('INSERT INTO contribution VALUES(?, ?)', userid, projectid, function(err) {
        if (err) { return done(err, null); }
        db.get('SELECT rowid FROM contribution WHERE user=? AND project=?', userid, projectid, function(err, row) {
          if (err) { return done(err, null); }
          if (row == null) { return done('Something weird happened: SELECT rowid FROM contribution returned null', null); }
          var contribid = row.rowid;
          db.run('INSERT INTO ownership VALUES (?, ?, 1000000000)', userid, contribid, done);
        });
      });
    });
  }
};

exports.ownership = {
  find_by_rowid: function(rowid, done) {
    db.get('SELECT ownership.rowid, ownership.user, ownership.quantity, contribution.user AS contributor, project.url FROM ownership INNER JOIN contribution ON ownership.contribution=contribution.rowid INNER JOIN project ON contribution.project=project.rowid WHERE ownership.rowid=?', rowid, done);
  }
};

exports.transaction = {
  transact: function(transfers, reason, done) {
    done('error', null);
  }
};
