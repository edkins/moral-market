var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db');

db.serialize(function() {
//db.run("CREATE TABLE user (email VARCHAR, admin BOOL, points INT)");
//db.run("INSERT INTO user VALUES ('edkins@gmail.com', 1, 1000000000)");
//db.run("CREATE TABLE charity (name VARCHAR)");
//db.run("CREATE TABLE fundraiser (charity INT, start DATETIME, end DATETIME, target REAL)");
//db.run("DROP TABLE charity");
//db.run("CREATE TABLE offer_donation (charity INT, max_money INT, points_per_money REAL)");
//db.run("CREATE TABLE request_donation (charity INT, max_points INT, points_per_money REAL)");
//db.run("ALTER TABLE offer_donation ADD COLUMN user INT");
//db.run("ALTER TABLE request_donation ADD COLUMN user INT");
//db.run("CREATE TABLE utility_rating (user INT, charity INT, utility_per_money REAL)");
//db.run("CREATE TABLE charity (handle VARCHAR, name VARCHAR)");
//db.run("INSERT INTO charity VALUES ('80K','80,000 Hours')");
//db.run("INSERT INTO charity VALUES ('ACE', 'Animal Charity Evaluators')");
//db.run("INSERT INTO charity VALUES ('CEA', 'Centre for Effective Altruism')");
//db.run("INSERT INTO charity VALUES ('CFAR', 'Center for Applied Rationality')");
//db.run("INSERT INTO charity VALUES ('CS', 'Charity Science')");
//db.run("INSERT INTO charity VALUES ('CSER', 'Centre for the Study of Existential Risk')");
//db.run("INSERT INTO charity VALUES ('EAV', 'Effective Altruism Ventures')");
//db.run("INSERT INTO charity VALUES ('FHI', 'Future of Humanity Institute')");
//db.run("INSERT INTO charity VALUES ('FLI', 'Future of Life Institute')");
//db.run("INSERT INTO charity VALUES ('GBS', 'GBS Switzerland')");
//db.run("INSERT INTO charity VALUES ('GW', 'GiveWell')");
//db.run("INSERT INTO charity VALUES ('GV', 'Good Ventures')");
//db.run("INSERT INTO charity VALUES ('GPP', 'Global Priorities Project')");
//db.run("INSERT INTO charity VALUES ('GWWC', 'Giving What We Can')");
//db.run("INSERT INTO charity VALUES ('LR', 'Leverage Research')");
//db.run("INSERT INTO charity VALUES ('MIRI', 'Machine Intelligence Research Institute')");
//db.run("INSERT INTO charity VALUES ('OPP', 'Open PHilanthropy Project')");
//db.run("INSERT INTO charity VALUES ('REG', 'Raising for Effective Giving')");
//db.run("INSERT INTO charity VALUES ('LYCS', 'The Life You Can Save')");
//db.run("INSERT INTO charity VALUES ('AMF', 'Against Malaria Foundation')");
//db.run("INSERT INTO charity VALUES ('GD', 'GiveDirectly')");
//db.run("INSERT INTO charity VALUES ('SCI', 'Schistosomiasis Control Initiative')");
//db.run("INSERT INTO charity VALUES ('DTW', 'Evidence Action: Deworm the World Initiative')");
//db.run("INSERT INTO charity VALUES ('PHC', 'Project Healthy Children')");
//db.run("INSERT INTO charity VALUES ('DMI', 'Development Media International')");
//db.run("INSERT INTO charity VALUES ('IGN', 'Iodine Global Network')");
//db.run("INSERT INTO charity VALUES ('GAIN', 'Global Alliance for Improved Nutrition')");
//db.run("INSERT INTO charity VALUES ('LG', 'Living Goods')");
//db.run("INSERT INTO charity VALUES ('SEVA', 'Seva Foundation')");
//db.run("INSERT INTO charity VALUES ('POS', 'Possible')");
//db.run("INSERT INTO charity VALUES ('PSI', 'Population Services International')");
//db.run("INSERT INTO charity VALUES ('OXF', 'Oxfam')");
//db.run("INSERT INTO charity VALUES ('IPA', 'Innovations for Poverty Action')");
//db.run("INSERT INTO charity VALUES ('FHF', 'The Fred Hollows Foundation')");
//db.run("INSERT INTO charity VALUES ('FF', 'Fistula Foundation')");
});