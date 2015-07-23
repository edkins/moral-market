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
  find_by_rowid: function(rowid, done) {
    db.get("SELECT rowid,* FROM user WHERE rowid=?", rowid, done);
  },
  all: function(done) {
    db.all("SELECT rowid,* FROM user", done);
  }
};

/*
Charities are hardcoded for now because each one requires
special processing to determine whether a donation actually happened
This list comes from http://www.effectivealtruism.org/organizations
*/
list_of_charities = [
  {handle:'80K',
    name:'80,000 Hours'},
  {handle:'ACE',
    name:'Animal Charity Evaluators'},
  {handle:'CEA',
    name:'Centre for Effective Altruism'},
  {handle:'CFAR',
    name:'Center for Applied Rationality'},
  {handle:'CS',
    name:'Charity Science'},
  {handle:'CSER',
    name:'Centre for the study of existential risk'},
  {handle:'EAV',
    name:'Effective Altruism Ventures'},
  {handle:'FHI',
    name:'Future of Humanity Institute'},
  {handle:'FLI',
    name:'Future of Life Institute'},
  {handle:'GBS',
    name:'GBS Switzerland'},
  {handle:'GW',
    name:'GiveWell'},
  {handle:'GV',
    name:'Good Ventures'},
  {handle:'GPP',
    name:'Global Priorities Project'},
  {handle:'GWWC',
    name:'Giving What We Can'},
  {handle:'LR',
    name:'Leverage Research'},
  {handle:'MIRI',
    name:'Machine Intelligence Research Institute'},
  {handle:'OPP',
    name:'Open PHilanthropy Project'},
  {handle:'REG',
    name:'Raising for Effective Giving'},
  {handle:'LYCS',
    name:'The Life You Can Save'},
  {handle:'AMF',
    name:'Against Malaria Foundation'},
  {handle:'GD',
    name:'GiveDirectly'},
  {handle:'SCI',
    name:'Schistosomiasis Control Initiative'},
  {handle:'DTW',
    name:'Evidence Action: Deworm the World Initiative'},
  {handle:'PHC',
    name:'Project Healthy Children'},
  {handle:'DMI',
    name:'Development Media International'},
  {handle:'IGN',
    name:'Iodine Global Network'},
  {handle:'GAIN',
    name:'Global Alliance for Improved Nutrition'},
  {handle:'LG',
    name:'Living Goods'},
  {handle:'SEVA',
    name:'Seva Foundation'},
  {handle:'POS',
    name:'Possible'},
  {handle:'PSI',
    name:'Population Services International'},
  {handle:'OXF',
    name:'Oxfam'},
  {handle:'IPA',
    name:'Innovations for Poverty Action'},
  {handle:'FHF',
    name:'The Fred Hollows Foundation'},
  {handle:'FF',
    name:'Fistula Foundation'}
]

exports.charity = {
  all: function(done) {
    done(null, list_of_charities);
  }
};
