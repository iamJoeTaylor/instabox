var argv = require('minimist')(process.argv.slice(2), {
  boolean: true,
  alias: {
    d: 'debug',
    s: 'search'
  }
});
var server = require('./../server');
var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.emit('init', {
    searchTag: argv.search,
    debug: argv.debug
  });
});

module.exports = io;
