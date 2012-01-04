var FILEPATH, Sockwaz, Twitter, express, fs, io, sockwaz, sys;
sys = require('sys');
express = require('express');
fs = require('fs');
io = require('socket.io');
Twitter = require('ntwitter');
FILEPATH = 'settings.json';
Sockwaz = (function() {
  function Sockwaz() {
    var _base, _base2;
    this.settings = JSON.parse(fs.readFileSync(FILEPATH, 'utf8'));
    (_base = this.settings).tracks || (_base.tracks = []);
    (_base2 = this.settings).port || (_base2.port = 8080);
    this.app = express.createServer();
    this.app.configure(function() {
      return this.use(express.static("" + __dirname + "/views"));
    });
    this.tw = new Twitter({
      consumer_key: this.settings.consumer_key,
      consumer_secret: this.settings.consumer_secret,
      access_token_key: this.settings.access_token_key,
      access_token_secret: this.settings.access_token_secret
    });
  }
  Sockwaz.prototype.listen = function() {
    this.app.listen(this.settings.port);
    this.socket = io.listen(this.app);
    this.socket.sockets.on('connection', function(socket) {
      socket.broadcast.emit('connected');
      return console.log("aaa");
    });
    return this.tw.stream('statuses/filter', {
      track: this.settings.tracks
    }, function(stream) {
      return stream.on('data', function(tweet) {
        return this;
      });
    });
  };
  return Sockwaz;
})();
sockwaz = new Sockwaz();
sockwaz.listen();