var express = require('express');
var app = express();
var server = require('http').Server(app);
var exec = require('child_process').exec;
var port = process.env.PORT || 8080;

/**
 * SERVER STUFF
 */
app.use('/web', express.static(__dirname + '/web'));
app.use('/images', express.static(__dirname + '/tmp'));

server.listen(port);
exec('open http://localhost:' + port);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/web/index.html');
});

module.exports = server;
