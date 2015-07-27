var database = require('./database.js');

function hash_add(hash, user, amount)
{
  if (hash[user] == null)
    hash[user] = amount;
  else
    hash[user] = hash[user] + amount;
}

exports.partition = function(contributor_emails, contributor_percentages, influence_urls, influence_percentages, done) {
  database.user.find_many_by_email(contributor_emails, function(err, contributors) {
    if (err) { return done(err); }
    database.project.find_many_by_url(influence_emails, function(err, influences) {
      if (err) { return done(err); }
      var user_dividends = {};
      var reason = '';
      for (var i = 0; i < contributors.length; i++) {
        var userid = contributers[i].rowid;
        var email = contributers[i].email;
        var amount = contributor_percentages[i] * 10000000;  /* turn % into billionths */
        reason += 'User ' + userid + '(' + email + ') received ' + amount + ' units due to direct contribution.\n';
        hash_add(user_dividends, userid, amount);
      }
      for (var i = 0; i < influences.length; i++)
      {
        var project_id = influences[i].rowid;
        var project_url = influences[i].url;
        var amount = influence_percentages[i] * 10000000;
      }
      var transfers = [];
//db.run("CREATE TABLE transfer (transactio INT, contribution INT, user_from INT, user_to INT, quantity INT)");
        database.transfer.add_many
    }
  }
};
