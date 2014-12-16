var exec = require('child_process').exec;
var Canvas = require('canvas');
var Image = Canvas.Image;
var fs = require('fs');
var port = process.env.PORT || 8080;
var io = require('./io');

function Photo(photo, debug) {
  this.id = photo.id;
  this.user = photo.user;
  this.link = photo.link;
  this.createdTime = photo.created_time;
  this.images = photo.images;
  this.dir = '/../tmp';
  this.debug = debug;
}

Photo.prototype.print = function() {
  var self = this;
  this.download(function(err, stdout, stderr) {
    if(err) throw err;

    io.emit('photo', self);

    self.addBorder(function() {
      if(self.debug) return self.log('PRINTING: lpr -r ' + __dirname + self.dir + '/' + self.id + '.jpg');
      exec('lpr -r ' + __dirname + self.dir + '/' + self.id + '.jpg');
    });
  });
};

Photo.prototype.addBorder = function(cb) {
  var canvas = new Canvas(700, 890);
  var ctx = canvas.getContext('2d');
  var self = this;
  this.log('READING: ' + __dirname + this.dir + '/' + this.id + '.jpg');
  fs.readFile(__dirname + this.dir + '/' + this.id + '.jpg', function(err, _instagram) {
    fs.readFile(__dirname + '/../border.png', function(err, _border) {
      if(err) throw err;
      var border = new Image;
      border.src = _border;
      ctx.drawImage(border, 0, 0, border.width, border.height);
      var instagram = new Image;
      instagram.src = _instagram;
      ctx.drawImage(instagram, 28, 24, instagram.width, instagram.height);

      canvas.toBuffer(function(err, buf){
        if(err) throw err;
        self.log('WRITING: ' + __dirname + self.dir + '/' + self.id + '.jpg');
        fs.writeFile(__dirname + self.dir + '/' + self.id + '.jpg', buf, cb);
      });
    });
  });
};

Photo.prototype.download = function(cb) {
  var commands = [
    'pushd ' + __dirname + this.dir,
    'curl -o ' + this.id + '.jpg ' + this.images.standard_resolution.url,
    'popd'
  ];

  exec(commands.join(';'), cb);
};

Photo.prototype.log = function(message) {
  if(this.debug) {
    console.log(message);
  }
};

module.exports = Photo;
