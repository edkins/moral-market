var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var exists = fs.existsSync('db');
var db = new sqlite3.Database('db');

exports.user = {
  find_or_create_by_email: function(email, done) {
    db.get("SELECT rowid,* FROM user WHERE email=?", email, function(err,user){
      if (user == null) {
        db.run("INSERT INTO user VALUES (?, 0, 0)", email, function(err,dummy){
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
    db.all('SELECT project.rowid, project.url, contribution.user AS contributor_id, user.email AS contributor_email FROM project LEFT JOIN contribution ON project.rowid=contribution.project LEFT JOIN user ON user.rowid=contribution.user', done);
  },
  add: function(url,done) {
    db.run('INSERT INTO project VALUES (?)', url, done);
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
        db.run('SELECT rowid FROM contribution WHERE user=?, project=?', userid, projectid, function(err, row) {
          if (err) { return done(err, null); }
          var contribid = row.rowid;
          db.run('INSERT INTO ownership VALUES (?, ?, 1000000000)', userid, contribid, done);
        });
      });
    });
  }
};

exports.transaction = {
  transact: function(transfers, reason, done) {
    done('error', null);
  }
};
