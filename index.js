var argv = require('minimist')(process.argv.slice(2), {
  boolean: true,
  alias: {
    d: 'debug',
    s: 'search'
  }
});
var configJSON = require('./config');
var Collection = require('./lib/collection');
var Instagram = require('instagram-node-lib');
var express = require('express');
var app = express();
var port = process.env.PORT || 3700;

var clientID = configJSON.clientID;
var clientSecret = configJSON.clientSecret;

/**
 * Set the configuration
 */
Instagram.set('client_id', clientID);
Instagram.set('client_secret', clientSecret);

new Collection({
  searchTag: argv.search,
  debug: argv.debug
});

app.listen(port);
