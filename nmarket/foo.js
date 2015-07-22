var connect = require('connect');
var render = require('connect-render');

var app = connect();

app.use(
  render({
    root: __dirname + '/views',
    layout: 'layout.html',
    cache: true, // `false` for debug
    helpers: {
      sitename: 'connect-render demo site',
      starttime: new Date().getTime(),
      now: function (req, res) {
        return new Date();
      }
    }
  })
);

app.use(function (req, res) {
    res.render('index.html', { url: req.url });
});

app.listen(8080);
