var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var exists = fs.existsSync('db');
var db = new sqlite3.Database('db');

if (!exists) {
  console.log("Creating new database!");
  db.serialize(function() {
    db.run("CREATE TABLE user (email VARCHAR, admin BOOL, points INT)");
    db.run("INSERT INTO user VALUES ('edkins@gmail.com', 1, 1000000000)");
    db.run("CREATE TABLE charity (name VARCHAR)");
    db.run("CREATE TABLE fundraiser (charity INT, start DATETIME, end DATETIME, target REAL)");
  });
}

exports.user = {
  find_by_email: function(email, done) {
    console.log('find_by_email ' + email);
    db.get("SELECT rowid,* FROM user WHERE email=?", email, function(err,row) {
      console.log('err: ' + err + ", row: " + row);
      done(err,row);
    });
  },
  find_by_rowid: function(rowid, done) {
    db.get("SELECT rowid,* FROM user WHERE rowid=?", rowid, function(err,row) {
      console.log('err: ' + err + ", row: " + row);
      done(err,row);
    });
  }
};
