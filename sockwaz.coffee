sys = require 'sys'
app = require 'express'
fs = require 'fs'
Twitter = require 'ntwitter'

FILEPATH = 'settings.json'
settings = JSON.parse fs.readFileSync(FILEPATH, 'utf8')
settings.tracks or= []

tw = new Twitter
  consumer_key : settings.consumer_key,
  consumer_secret : settings.consumer_secret,
  access_token_key : settings.access_token_key,
  access_token_secret : settings.access_token_secret

tw.stream 'statuses/filter', { track : settings.tracks }, (stream) ->
  stream.on 'data', (tweet) ->
    console.log tweet['text']
