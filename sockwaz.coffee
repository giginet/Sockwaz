sys = require 'sys'
express = require 'express'
fs = require 'fs'
io = require 'socket.io'
Twitter = require 'ntwitter'

FILEPATH = 'settings.json'

class Sockwaz
  constructor : ->
    @settings = JSON.parse fs.readFileSync(FILEPATH, 'utf8')
    @settings.tracks or= []
    @settings.port or= 8080

    @app = express.createServer()
    @app.configure ->
      @use express.static("#{__dirname}/views")

    @tw = new Twitter
      consumer_key : @settings.consumer_key,
      consumer_secret : @settings.consumer_secret,
      access_token_key : @settings.access_token_key,
      access_token_secret : @settings.access_token_secret 

  listen : ->
    @app.listen @settings.port
    tw = @tw
    settings = @settings
    @socket = io.listen @app
    @socket.sockets.on 'connection', (client) ->
      tw.stream 'statuses/filter', { track : settings.tracks }, (stream) ->
        stream.on 'data', (tweet) ->
          client.emit 'tweet', JSON.stringify tweet

sockwaz = new Sockwaz()
sockwaz.listen()
