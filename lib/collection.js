var Photo = require('./photo');
var Instagram = require('instagram-node-lib');
var Promise = require('promise');

var getPhotos = function(search) {
  return new Promise(function(resolve, reject) {
    Instagram.tags.recent({ name: search,
      complete: function(data, pagination) {
        resolve(data);
      },
      error: function(errorMessage, errorObject, caller) {
        reject(errorObject);
      }
    });
  });
};

function Collection(opts) {
  if(!opts.searchTag) throw 'Must pass a searchtag';
  this.photos = {
    ids: [],
    objects: []
  };
  this.searchTag = opts.searchTag;
  this.queue = [];
  this.min = 10;
  this.searching = false;
  this.start();
  this.debug = !!opts.debug;
}

Collection.prototype.start = function() {
  this.find();
  this.process();
};

Collection.prototype.find = function() {
  var self = this;
  this.searching = true;
  getPhotos(this.searchTag).then(function(data) {
    data.forEach(function(photo) {
      self.addPhoto(new Photo(photo, self.debug));
    });
    self.searching = false;
  }, function(err) {
    if(err) throw err;
    self.searching = false;
  });
};

Collection.prototype.process = function() {
  if(this.queue.length) {
    this.queue.shift().print();
    this.process();
  } else {
    setTimeout(function() { this.process(); }.bind(this), 500);
  }
  if(this.queue.length < this.min && !this.searching) {
    this.log('refilling...');
    this.find();
  }
};

Collection.prototype.addPhoto = function(photo) {
  if(!this.photoExists(photo)) {
    this.photos.objects.push(photo);
    this.photos.ids.push(photo.id);
    this.queue.push(photo);
    this.log('added photo');
  }
};

Collection.prototype.photoExists = function(photo) {
  return this.photos.ids.indexOf(photo.id) > -1;
};

Collection.prototype.log = function(message) {
  if(this.debug) {
    console.log(message);
  }
};

module.exports = Collection;
